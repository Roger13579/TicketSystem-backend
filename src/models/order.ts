import { Schema, model } from 'mongoose';
import { ITimestamp } from '../types/common.type';
import { schemaOption } from '../utils/constants';
import { PaymentMethod, PaymentStatus } from '../types/order.type';

interface IOrder extends Document, ITimestamp {
  thirdPartyPaymentId: string;
  userId: Schema.Types.ObjectId;
  products: [object];
  price: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paidAt: Date;
  deliveryInfo: object;
}

const schema = new Schema<IOrder>(
  {
    thirdPartyPaymentId: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
          },
          name: String,
          price: Number,
          amount: Number,
        },
      ],
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
