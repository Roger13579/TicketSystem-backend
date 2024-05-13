import { Schema, model } from 'mongoose';
import { schemaOption } from '../utils/constants';
import {
  ICartProduct,
  IDeliveryInfo,
  PaymentMethod,
  PaymentStatus,
} from '../types/order.type';
import { BaseModel, IUserId, schemaDef } from './baseModel';

interface IOrder extends BaseModel, IUserId {
  thirdPartyPaymentId: string;
  products: [ICartProduct];
  price: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paidAt?: Date;
  deliveryInfo?: IDeliveryInfo;
}

const { userId } = schemaDef;

const schema = new Schema<IOrder>(
  {
    thirdPartyPaymentId: {
      type: String,
      required: true,
    },
    userId,
    products: {
      type: [schemaDef.cartProduct],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    paidAt: {
      type: Date,
    },
    deliveryInfo: {
      type: {
        name: String,
        address: String,
        phone: String,
        email: String,
      },
    },
  },
  schemaOption,
);

const OrderModel = model<IOrder>('Order', schema);

export default OrderModel;
