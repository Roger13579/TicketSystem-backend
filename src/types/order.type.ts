import { IUserReq, SortOrder } from './common.type';
import { IPlan } from './product.type';
import { IProductId } from '../models/baseModel';
import { IOrderProduct } from '../models/order';
import { IProduct } from '../models/product';
import { Request } from 'express';
import { Types } from 'mongoose';

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

export interface IDeliveryInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface IOrderItem extends IProductId {
  amount: number;
  plan?: IPlan;
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
  query: {
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
    page?: string;
    limit?: string;
    sortField?: OrderSortField;
    sortOrder?: SortOrder;
  };
}

export interface IValidateAmount {
  item: IOrderItem;
  product: IProduct;
}

export interface IValidatePrice {
  products: IOrderProduct[];
  totalPrice: number;
}

export interface ILinePayConfirmReq extends Request {
  query: {
    transactionId?: string;
    orderId?: string;
  };
}

export interface IUpdateOrderParam {
  orderId: Types.ObjectId;
  thirdPartyPaymentId: string;
  paymentStatus: PaymentStatus;
  paidAt?: Date;
}
