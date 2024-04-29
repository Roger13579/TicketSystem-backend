import { Schema, model } from 'mongoose';

interface ICart {
  userId: Schema.Types.ObjectId;
  products: [object];
}

const schema = new Schema<ICart>({
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
});

const CartModel = model<ICart>('Cart', schema);

export default CartModel;
