import { IUserReq } from './common.type';
import { Types } from 'mongoose';
import { IProductSnapshot } from './product.type';

export enum PaymentMethod {
  linePay = 'linePay',
  ecPay = 'ecPay',
  newebPay = 'newebPay',
}

export enum PaymentStatus {
  paid = 'paid', // 已付款
  pending = 'pending', // 未付款
  refunded = 'refunded', // 已退款
  expired = 'expired', // 已過期
  failed = 'failed', // 付款失敗
}

export enum OrderSortBy {
  createdAt = 'createdAt',
  paidAt = 'paidAt',
  status = 'status',
  thirdPartyPaymentId = 'thirdPartyPaymentId',
}

export interface IDeliveryInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface ICreateOrderReq extends IUserReq {
  body: {
    userId: Types.ObjectId;
    products: [IProductSnapshot];
    price: string;
    paymentMethod: string;
    paymentStatus: string;
    paidAt: Date;
    deliveryInfo: {
      name: string;
      address: string;
      phone: string;
      email: string;
    };
  };
}
export type NewebpayResponse = {
  Status: string;
  Message: string;
  Result: {
    MerchantID: string;
    Amt: number;
    TradeNo: string;
    MerchantOrderNo: string;
    PaymentType: string;
    RespondType: string;
    PayTime: Date;
    IP: string;
    EscrowBank: string;
  };
};
export interface IGetOrdersReq extends IUserReq {
  query: {
    status?: string;
    ids?: string;
    thirdPartyPaymentIds?: string;
    accounts?: string;
    emails?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    phones?: string;
    paidAtFrom?: string;
    paidAtTo?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
  };
}
