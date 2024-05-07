import { Schema, model } from 'mongoose';
import { ITimestamp } from '../types/common.type';
import { schemaOption } from '../utils/constants';

interface ICart extends Document, ITimestamp {
  userId: Schema.Types.ObjectId;
  products: [object];
}

const schema = new Schema<ICart>(
  {
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
  },
  schemaOption,
);

const CartModel = model<ICart>('Cart', schema);

export default CartModel;
