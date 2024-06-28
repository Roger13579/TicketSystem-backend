import { IUserReq, TPaginationQuery } from './common.type';
import { IPlan, IProductId } from './product.type';
import { IProduct } from '../models/product';
import { Types } from 'mongoose';
import { IOrder } from '../models/order';

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

export enum OrderSortField {
  createdAt = 'createdAt',
  paidAt = 'paidAt',
  status = 'status',
  thirdPartyPaymentId = 'thirdPartyPaymentId',
}

export interface IOrderId {
  orderId: Types.ObjectId;
}

export interface IDeliveryInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface IOrderItem extends IProductId {
  amount: number;
  plan: IPlan;
}

export interface ICreateOrderReq extends IUserReq {
  body: {
    items: [IOrderItem];
    price: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    deliveryInfo: IDeliveryInfo;
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
  query: TPaginationQuery<OrderSortField> & {
    status?: PaymentStatus;
    ids?: string;
    thirdPartyPaymentIds?: string;
    accounts?: string;
    emails?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    phones?: string;
    paidAtFrom?: string;
    paidAtTo?: string;
  };
}

export interface IValidateAmount {
  item: IOrderItem;
  product: IProduct;
}

export interface IValidatePrice {
  price: number;
  validPrice: number;
}

export interface ILinePayConfirmReq extends IUserReq {
  query: {
    transactionId?: string;
    orderId?: string;
  };
}

export interface IUpdateOrderParam extends IOrderId {
  thirdPartyPaymentId: string;
  paymentStatus: PaymentStatus;
  paidAt?: Date;
}

export interface INewebPayCheckOrderReq extends IUserReq {
  body: { TradeInfo: string; TradeSha: unknown };
}

export interface IGetOrderParam extends IOrder {
  thirdPartyPaymentId: string;
  paidAt: Date;
}

export type OrderDocumentWithPayment = Document &
  IGetOrderParam & {
    _id: Types.ObjectId;
  };
