import { Schema, model } from 'mongoose';
import { schemaOption } from '../utils/constants';
import { BaseModel, IUserId, ModelName, schemaDef } from './baseModel';
import { ICartProduct } from '../types/order.type';

interface ICart extends BaseModel, IUserId {
  products: [ICartProduct];
}

const { userId, cartProduct } = schemaDef;

const schema = new Schema<ICart>(
  {
    userId,
    products: {
      type: [cartProduct],
      required: true,
    },
  },
  schemaOption,
);

const CartModel = model<ICart>(ModelName.cart, schema);

export default CartModel;
