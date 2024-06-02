import { Schema, model } from 'mongoose';
import { schemaOption, virtualSchemaOption } from '../utils/constants';
import {
  BaseModel,
  IProductId,
  IUserId,
  ModelName,
  schemaDef,
} from './baseModel';

const { userId, productId } = schemaDef;

interface IItem extends IProductId, BaseModel {
  amount: number;
}

const ItemSchema = new Schema<IItem>(
  {
    productId: { ...productId, unique: true },
    amount: { type: Number, required: true, min: 1 },
  },
  { ...schemaOption, _id: false, ...virtualSchemaOption },
);

ItemSchema.index({ productId: 1 }, { unique: true });

ItemSchema.virtual('product').get(function () {
  return this.productId;
});

ItemSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.productId;
  return obj;
};

export interface ICart extends BaseModel, IUserId {
  items: [IItem];
}

const schema = new Schema<ICart>(
  {
    userId,
    items: {
      type: [ItemSchema],
      required: true,
    },
  },
  schemaOption,
);

const CartModel = model<ICart>(ModelName.cart, schema);

export default CartModel;
