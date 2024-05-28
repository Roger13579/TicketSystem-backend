import { Request } from 'express';
import log4js from '../config/log4js';
import * as crypto from 'node:crypto';
import { CreateOrderDto } from '../dto/order/createOrderDto';
import { OrderRepository } from '../repository/orderRepository';
import { IOrder } from '../models/order';
import { ProductRepository } from '../repository/productRepository';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { NewebpayOrderDto } from '../dto/order/newebpayOrderDto';
import { NewebpayOrderVo } from '../vo/order/newebpayOrderVo';
import { NewebpayResponse } from '../types/order.type';
import {
  PaginateDocument,
  PaginateOptions,
  PaginateResult,
  Types,
} from 'mongoose';
import { checkDateOrder } from '../utils/common';
import { OrderFilterDto } from '../dto/order/orderFilterDto';

const logger = log4js.getLogger(`OrderService`);

export class OrderService {
  private readonly orderRepository: OrderRepository = new OrderRepository();
  private readonly productRepository: ProductRepository =
    new ProductRepository();

  public findOrders = async (
    orderFilterDTO: OrderFilterDto,
  ): Promise<
    PaginateResult<
      PaginateDocument<IOrder, NonNullable<unknown>, PaginateOptions>
    >
  > => {
    const { createdAtFrom, createdAtTo, paidAtFrom, paidAtTo } = orderFilterDTO;

    // 確認時間順序
    checkDateOrder(
      { prop: 'createdAtFrom', value: createdAtFrom },
      { prop: 'createdAtTo', value: createdAtTo },
      { prop: 'paidAtFrom', value: paidAtFrom },
      { prop: 'paidAtTo', value: paidAtTo },
    );

    return await this.orderRepository.findOrders(orderFilterDTO);
  };

  public async createOrder(createOrderDto: CreateOrderDto): Promise<IOrder> {
    const productIds = createOrderDto.products.map(
      (product) => product.productId,
    );
    for (const id of productIds) {
      const product = await this.productRepository.findById(id);
      if (product) {
        if (product.amount < 1) {
          throwError(
            CustomResponseType.PRODUCT_SOLD_OUT_MESSAGE,
            CustomResponseType.PRODUCT_SOLD_OUT,
          );
        }
      } else {
        throwError(
          CustomResponseType.PRODUCT_NOT_FOUND_MESSAGE,
          CustomResponseType.PRODUCT_NOT_FOUND,
        );
      }
    }
    return await this.orderRepository.createOrder(createOrderDto);
  }
  public async newebpayProcess(order: IOrder): Promise<NewebpayOrderVo> {
    // 使用 Unix Timestamp 作為訂單編號（金流也需要加入時間戳記）
    const newebpayOrderDto = new NewebpayOrderDto(order);

    // 進行訂單加密
    // 加密第一段字串，此段主要是提供交易內容給予藍新金流
    const aesEncrypt = this.createSesEncrypt(newebpayOrderDto);
    logger.info('aesEncrypt:', aesEncrypt);

    // 使用 HASH 再次 SHA 加密字串，作為驗證使用
    const shaEncrypt = this.createShaEncrypt(aesEncrypt);
    logger.info('shaEncrypt:', shaEncrypt);
    return new NewebpayOrderVo(shaEncrypt, aesEncrypt);
  }

  public async checkOrder(req: Request): Promise<IOrder | null> {
    logger.info('req.body notify data', req.body);
    const response = req.body;

    // 解密交易內容
    const data = this.createSesDecrypt(response.TradeInfo);
    logger.info('data:', data);

    // 取得交易內容，並查詢本地端資料庫是否有相符的訂單
    const order = await this.orderRepository.findById(
      new Types.ObjectId(data?.Result?.MerchantOrderNo),
    );
    if (!order) {
      throwError(
        CustomResponseType.NO_DATA_FOUND_MESSAGE,
        CustomResponseType.NO_DATA_FOUND,
      );
    }
    // 使用 HASH 再次 SHA 加密字串，確保比對一致（確保不正確的請求觸發交易成功）
    const thisShaEncrypt = this.createShaEncrypt(response.TradeInfo);
    if (!thisShaEncrypt === response.TradeSha) {
      throwError(
        CustomResponseType.PAYMENT_ERROR_TRADESHA_MESSAGE,
        CustomResponseType.PAYMENT_ERROR_TRADESHA,
      );
    }
    // 交易完成，將成功資訊儲存於資料庫
    return await this.orderRepository.updateOrder(
      new Types.ObjectId(data?.Result?.MerchantOrderNo),
      data.Result.TradeNo,
    );
    //TODO 派發票券Ticket
  }
  // 字串組合
  private genDataChain(newebpayOrderDto: NewebpayOrderDto): string {
    return `MerchantID=${process.env.MERCHANT_ID}&TimeStamp=${
      newebpayOrderDto.TimeStamp
    }&Version=${process.env.VERSION}&RespondType=JSON&MerchantOrderNo=${
      newebpayOrderDto.MerchantOrderNo
    }&Amt=${newebpayOrderDto.Amt}&NotifyURL=${encodeURIComponent(
      process.env.NOTIFY_URL as string,
    )}&ReturnURL=${encodeURIComponent(process.env.RETURN_URL as string)}&ItemDesc=${encodeURIComponent(
      'test',
    )}&Email=${encodeURIComponent(newebpayOrderDto.email)}`;
  }
  private createSesEncrypt(newebpayOrderDto: NewebpayOrderDto): string {
    const encrypt = crypto.createCipheriv(
      'aes-256-gcm',
      process.env.HASHKEY as string,
      process.env.HASHIV as string,
    );
    const enc = encrypt.update(
      this.genDataChain(newebpayOrderDto),
      'utf8',
      'hex',
    );
    return enc + encrypt.final('hex');
  }

  private createShaEncrypt(aesEncrypt: string): string {
    const sha = crypto.createHash('sha256');
    const plainText = `HashKey=${process.env.HASHKEY}&${aesEncrypt}&HashIV=${process.env.HASHIV}`;

    return sha.update(plainText).digest('hex').toUpperCase();
  }

  private createSesDecrypt(tradeInfo: string): NewebpayResponse {
    const decrypt = crypto.createDecipheriv(
      'aes-256-gcm',
      process.env.HASHKEY as string,
      process.env.HASHIV as string,
    );
    decrypt.setAutoPadding(false);
    const text = decrypt.update(tradeInfo, 'hex', 'utf8');
    const plainText = text + decrypt.final('utf8');
    const result = plainText.replace(/[\x00-\x20]+/g, '');
    return JSON.parse(result);
  }
}
