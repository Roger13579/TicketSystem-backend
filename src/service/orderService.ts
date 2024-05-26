import { Request } from 'express';
import { UserRepository } from '../repository/userRepository';
import { IUser } from '../models/user';
import log4js from '../config/log4js';
import * as crypto from 'node:crypto';
import { CreateOrderDto } from "../dto/order/createOrderDto";
import { OrderRepository } from "../repository/orderRepository";
import { IOrder } from "../models/order";
import { ProductRepository } from "../repository/productRepository";
import product from "../models/product";
import { throwError } from "../utils/errorHandler";
import { CustomResponseType } from "../types/customResponseType";
const logger = log4js.getLogger(`OrderService`);

export class OrderService {
  private readonly orderRepository: OrderRepository = new OrderRepository();
  private readonly productRepository: ProductRepository = new ProductRepository();

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
          CustomResponseType.PRODUCT_NOT_FOUND)
      }
    }
    return await this.orderRepository.createOrder(createOrderDto);
  }

  public async checkOrder(req: Request): Promise<IOrder | void> {
    console.log('req.body notify data', req.body);
    const response = req.body;

    // 解密交易內容
    const data = this.createSesDecrypt(response.TradeInfo);
    console.log('data:', data);

    // 取得交易內容，並查詢本地端資料庫是否有相符的訂單
    console.log(orders[data?.Result?.MerchantOrderNo]);
    if (!orders[data?.Result?.MerchantOrderNo]) {
      console.log('找不到訂單');
    }

    // 使用 HASH 再次 SHA 加密字串，確保比對一致（確保不正確的請求觸發交易成功）
    const thisShaEncrypt = this.createShaEncrypt(response.TradeInfo);
    if (!thisShaEncrypt === response.TradeSha) {
      console.log('付款失敗：TradeSha 不一致');
    }

    // 交易完成，將成功資訊儲存於資料庫
    console.log('付款完成，訂單：', orders[data?.Result?.MerchantOrderNo]);

  }
  // 字串組合
  private genDataChain(order: IOrder): string {
    return `MerchantID=${order.MerchantID}&TimeStamp=${
      order.TimeStamp
    }&Version=${process.env.VERSION}&RespondType=${String}&MerchantOrderNo=${
      order.MerchantOrderNo
    }&Amt=${order.Amt}&NotifyURL=${encodeURIComponent(
      process.env.NOTIFY_URL,
    )}&ReturnURL=${encodeURIComponent(process.env.RETURN_URL)}&ItemDesc=${encodeURIComponent(
      order.ItemDesc,
    )}&Email=${encodeURIComponent(order.Email)}`;
  }
  // 對應文件 P17
  // MerchantID=MS12345678&TimeStamp=1663040304&Version=2.0&RespondType=Stri
  // ng&MerchantOrderNo=Vanespl_ec_1663040304&Amt=30&NotifyURL=https%3A%2F%2
  // Fwebhook.site%2Fd4db5ad1-2278-466a-9d66-
  // 78585c0dbadb&ReturnURL=&ItemDesc=test

  // 對應文件 P17：使用 aes 加密
  // $edata1=bin2hex(openssl_encrypt($data1, "AES-256-CBC", $key, OPENSSL_RAW_DATA, $iv));
  private createSesEncrypt(tradeInfo: string): string {
    const encrypt = crypto.createCipheriv(
      'aes-256-gcm',
      process.env.HASHKEY as string,
      process.env.HASHIV as string,);
    const enc = encrypt.update(this.genDataChain(tradeInfo), 'utf8', 'hex');
    return enc + encrypt.final('hex');
  }

  // 對應文件 P18：使用 sha256 加密
  // $hashs="HashKey=".$key."&".$edata1."&HashIV=".$iv;
  private createShaEncrypt(aesEncrypt: string): string {
    const sha = crypto.createHash('sha256');
    const plainText = `HashKey=${process.env.HASHKEY}&${aesEncrypt}&HashIV=${process.env.HASHIV}`;

    return sha.update(plainText).digest('hex').toUpperCase();
  }

  // 對應文件 21, 22 頁：將 aes 解密
  private createSesDecrypt(tradeInfo: string): object {
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
