import { Schema } from 'mongoose';

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

export interface ICartProduct {
  productId: Schema.Types.ObjectId;
  name: string;
  price: number;
  amount: number;
}

export interface IDeliveryInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}
