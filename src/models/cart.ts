import { Schema, model } from 'mongoose';
import { schemaOption, virtualSchemaOption } from '../utils/constants';
import { BaseModel, ModelName, schemaDef } from './baseModel';
import { IPlan, IProductId } from '../types/product.type';
import { IUserId } from '../types/user.type';

const { userId, productId, plan } = schemaDef;

export interface IItem extends IProductId, BaseModel {
  amount: number;
  plan: IPlan;
}

const ItemSchema = new Schema<IItem>(
  {
    productId,
    amount: { type: Number, required: true, min: 1 },
    plan,
  },
  {
    ...schemaOption,
    _id: false,
    ...virtualSchemaOption,
  },
);

ItemSchema.index(
  {
    productId: 1,
    'plan.name': 1,
    'plan.discount': 1,
    'plan.headCount': 1,
  },
  { unique: true },
);

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
