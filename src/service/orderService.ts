import { Request } from 'express';
import log4js from '../config/log4js';
import * as crypto from 'node:crypto';
import { CreateOrderDto } from '../dto/order/createOrderDto';
import { OrderRepository } from '../repository/orderRepository';
import { IOrder, IOrderProduct } from '../models/order';
import { ProductRepository } from '../repository/productRepository';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { NewebpayOrderDto } from '../dto/order/newebpayOrderDto';
import { NewebpayOrderVo } from '../vo/order/newebpayOrderVo';
import {
  IValidateAmount,
  IValidatePrice,
  NewebpayResponse,
  PaymentStatus,
} from '../types/order.type';
import {
  PaginateDocument,
  PaginateOptions,
  PaginateResult,
  Types,
} from 'mongoose';
import { checkDateOrder } from '../utils/common';
import { OrderFilterDto } from '../dto/order/orderFilterDto';
import axios from 'axios';
import {
  ICreateLinePayReqParams,
  LinePayCurrency,
  LinePayReturnCode,
  ILinePayData,
  ILinePayConfirmData,
} from '../types/line.type';
import { LinePayOrderDTO } from '../dto/order/linePayOrderDto';
import { LinePayConfirmDTO } from '../dto/order/linePayConfirmDto';
import { get, some, sumBy } from 'lodash';

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
    const validProducts: IOrderProduct[] = [];
    const { items, price } = createOrderDto;
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      // 1. 確認各商品存在
      if (product) {
        const isValidAmount = this.validateAmount({ item, product });

        // 2. 確認各商品存貨
        if (!isValidAmount) {
          throwError(
            CustomResponseType.PRODUCT_SOLD_OUT_MESSAGE,
            CustomResponseType.PRODUCT_SOLD_OUT,
          );
        }

        // 3. 若存在方案，確認方案是否正確

        const isValidPlan = this.validatePlan({ item, product });

        if (!isValidPlan) {
          throwError(
            CustomResponseType.ORDER_PLAN_ERROR_MESSAGE,
            CustomResponseType.ORDER_PLAN_ERROR,
          );
        }

        const validProduct = CreateOrderDto.createValidProduct({
          item,
          product,
        });

        validProducts.push(validProduct);
      } else {
        throwError(
          CustomResponseType.PRODUCT_NOT_FOUND_MESSAGE,
          CustomResponseType.PRODUCT_NOT_FOUND,
        );
      }
    }

    // 3. 確認總價格正確
    const isValidPrice = this.validatePrice({
      products: validProducts,
      totalPrice: price,
    });

    if (!isValidPrice) {
      throwError(
        CustomResponseType.INVALID_ORDER_PRICE_MESSAGE,
        CustomResponseType.INVALID_ORDER_PRICE,
      );
    }

    createOrderDto.setProducts = validProducts;

    return await this.orderRepository.createOrder(createOrderDto);
  }

  public async linePayConfirmOrder(linePayConfirmDto: LinePayConfirmDTO) {
    const { orderId, transactionId } = linePayConfirmDto;
    const order = await this.orderRepository.findById(
      new Types.ObjectId(orderId),
    );
    if (!order) {
      return;
    }
    const body = {
      amount: order.price,
      currency: LinePayCurrency.TWD,
    };
    const uri = `/${process.env.LINEPAY_VERSION}/payments/${transactionId}/confirm`;
    const { headers, url } = this.createLinePayReq({
      uri,
      body,
      orderId: order._id.toString(),
    });
    try {
      const res: { data: ILinePayConfirmData } = await axios.post(url, body, {
        headers,
      });

      const { returnCode, info, returnMessage } = res.data;

      if (returnCode === LinePayReturnCode.success && info) {
        // 更改狀態為付款成功
        const updatedOrder = await this.orderRepository.updateOrder({
          orderId: new Types.ObjectId(orderId),
          thirdPartyPaymentId: info.transactionId.toString(),
          paymentStatus: PaymentStatus.paid,
          paidAt: new Date(),
        });
        const { products } = updatedOrder as IOrder;
        // 更改 product soldAmount
        await this.productRepository.editProductsSoldAmount(products);
        return updatedOrder;
      } else {
        // TODO: 確認是否要給予付款失敗的狀態
        const error = new Error(returnMessage);
        error.name = returnCode;
        throw error;
      }
    } catch (err) {
      logger.error('linepay confirm error', err);
      throwError(
        CustomResponseType.INVALID_ORDER_PRICE_MESSAGE,
        CustomResponseType.INVALID_ORDER_PRICE,
      );
    }
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

  public async linePayProcess(order: IOrder) {
    const { body, orderId } = new LinePayOrderDTO(order);
    const uri = `/${process.env.LINEPAY_VERSION}/payments/request`;
    const { headers, url } = this.createLinePayReq({
      uri,
      body,
      orderId,
    });

    try {
      // 新增 LinePay 訂單
      const res: { data: ILinePayData } = await axios.post(url, body, {
        headers,
      });

      const { returnCode, info, returnMessage } = res.data;

      if (returnCode === LinePayReturnCode.success && !!info) {
        const { paymentUrl, transactionId } = info;
        const params = {
          orderId: new Types.ObjectId(orderId),
          thirdPartyPaymentId: transactionId.toString(),
          paymentStatus: PaymentStatus.pending,
        };
        await this.orderRepository.updateOrder(params);
        return { paymentUrl: paymentUrl.web };
      } else {
        const error = new Error(returnMessage);
        error.name = returnCode;
        throw error;
      }
    } catch (err) {
      logger.error('linepay create payment Url error', err);
      throwError(
        CustomResponseType.LINEPAY_ERROR_MESSAGE,
        CustomResponseType.LINEPAY_ERROR,
      );
    }
  }

  public async newebPayCheckOrder(req: Request): Promise<IOrder | null> {
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

    const params = {
      orderId: new Types.ObjectId(data.Result.MerchantOrderNo),
      thirdPartyPaymentId: data.Result.TradeNo,
      paymentStatus: PaymentStatus.paid,
      paidAt: new Date(),
    };
    // 交易完成，將成功資訊儲存於資料庫
    const updatedOrder = await this.orderRepository.updateOrder(params);
    const { products } = updatedOrder as IOrder;
    // 更改 product soldAmount
    await this.productRepository.editProductsSoldAmount(products);
    return updatedOrder;
    //TODO 派發票券Ticket
  }

  // 字串組合
  private genDataChain(newebpayOrderDto: NewebpayOrderDto): string {
    return `MerchantID=${process.env.NEWEBPAY_MERCHANT_ID}&TimeStamp=${
      newebpayOrderDto.TimeStamp
    }&Version=${process.env.NEWEBPAY_VERSION}&RespondType=JSON&MerchantOrderNo=${
      newebpayOrderDto.MerchantOrderNo
    }&Amt=${newebpayOrderDto.Amt}&NotifyURL=${encodeURIComponent(
      process.env.NEWEBPAY_NOTIFY_URL,
    )}&ReturnURL=${encodeURIComponent(process.env.RETURN_URL)}&ItemDesc=${encodeURIComponent(
      'test',
    )}&Email=${encodeURIComponent(newebpayOrderDto.email)}`;
  }

  private createSesEncrypt(newebpayOrderDto: NewebpayOrderDto): string {
    const encrypt = crypto.createCipheriv(
      'aes-256-cbc',
      process.env.HASHKEY,
      process.env.HASHIV,
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
      'aes-256-cbc',
      process.env.HASHKEY,
      process.env.HASHIV,
    );
    decrypt.setAutoPadding(false);
    const text = decrypt.update(tradeInfo, 'hex', 'utf8');
    const plainText = text + decrypt.final('utf8');
    const result = plainText.replace(/[\x00-\x20]+/g, '');
    return JSON.parse(result);
  }

  private validateAmount = ({ item, product }: IValidateAmount) => {
    const required = item.amount * get(item, 'plan.headCount', 1);
    const remain = product.amount - product.soldAmount;
    return remain > required;
  };

  private validatePlan = ({ item, product }: IValidateAmount) => {
    if (item.plan) {
      return some(product.plans, {
        discount: item.plan.discount,
        headCount: item.plan.headCount,
      });
    }
    return true;
  };

  private validatePrice = ({ products, totalPrice }: IValidatePrice) => {
    const subTotal = sumBy(
      products,
      ({ price, amount, plan }) =>
        price * amount * (plan ? plan.headCount * plan.discount : 1),
    );
    return totalPrice === subTotal;
  };

  private createLinePayReq = (params: ICreateLinePayReqParams) => {
    const { body, orderId, uri } = params;
    const nonce = new Date().valueOf().toString() + orderId.toString();
    const string = `${process.env.LINEPAY_CHANNEL_SECRET_KEY}${uri}${JSON.stringify(body)}${nonce}`;
    const hmac = crypto.createHmac(
      'sha256',
      process.env.LINEPAY_CHANNEL_SECRET_KEY,
    );
    hmac.update(string);
    const signature = hmac.digest('base64');

    const headers = {
      'Content-Type': 'application/json',
      'X-LINE-ChannelId': process.env.LINEPAY_CHANNEL_ID,
      'X-LINE-Authorization-Nonce': nonce,
      'X-LINE-Authorization': signature,
    };

    const url = `${process.env.LINEPAY_SITE}${uri}`;
    return { headers, url };
  };
}
