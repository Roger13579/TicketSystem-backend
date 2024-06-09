import { Schema, model, PaginateModel } from 'mongoose';
import { schemaOption, virtualSchemaOption } from '../utils/constants';
import {
  IDeliveryInfo,
  IOrderItem,
  PaymentMethod,
  PaymentStatus,
} from '../types/order.type';
import {
  BaseModel,
  IUserId,
  ModelName,
  productSnapshotSchemaDef,
  schemaDef,
} from './baseModel';
import { IProductSnapshot } from '../types/product.type';
import paginate from 'mongoose-paginate-v2';

export interface IOrderProduct extends IProductSnapshot, IOrderItem {}

export interface IOrder extends BaseModel, IUserId {
  thirdPartyPaymentId: string;
  products: IOrderProduct[];
  price: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paidAt?: Date;
  deliveryInfo?: IDeliveryInfo;
}

const { userId, productId, plan } = schemaDef;

const schema = new Schema<IOrder>(
  {
    thirdPartyPaymentId: { type: String },
    userId,
    products: {
      type: [
        {
          ...productSnapshotSchemaDef,
          productId,
          amount: { type: Number, required: true, min: 1 },
          plan,
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
  { ...schemaOption, ...virtualSchemaOption },
).plugin(paginate);

schema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

export const OrderModel = model<IOrder, PaginateModel<IOrder>>(
  ModelName.order,
  schema,
);
