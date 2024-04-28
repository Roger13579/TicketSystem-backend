import {Schema, model} from 'mongoose';

interface IOrder {
  thirdPartyPaymentId: string;
  userId: Schema.Types.ObjectId;
  products: [object];
  price: number;
  paymentStatus: string;
  createAt: Date;
  updateAt: Date;
  paymentMethod: string;
  paidAt: Date;
  deliveryInfo: object;
}

const schema = new Schema<IOrder>({
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
      }
    ],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  updateAt: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ["LinePay", "ecPay", "newebPay"],
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
    }
  },
});

const OrderModel = model<IOrder>('Order', schema);

export default OrderModel;
