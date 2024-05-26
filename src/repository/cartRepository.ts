import { QueryOptions, Types } from 'mongoose';
import CartModel, { ICart } from '../models/cart';
import { EditCartProductDTO } from '../dto/cart/editCartProductDto';

const options: QueryOptions<ICart> = {
  new: true,
  runValidators: true,
  returnDocument: 'after',
};

export class CartRepository {
  public createCart = async (userId: Types.ObjectId) => {
    return await CartModel.create({ userId, items: [] });
  };

  public findCartByUserId = async (userId: Types.ObjectId) => {
    return await CartModel.findOne({ userId });
  };

  public addCartProduct = async (editCartProductDto: EditCartProductDTO) => {
    const { userId, productId, amount } = editCartProductDto;
    return await CartModel.findOneAndUpdate(
      { userId, 'items.productId': { $ne: productId } },
      { $push: { items: { productId, amount } } },
      options,
    );
  };

  public deleteCartProduct = async (editCartProductDto: EditCartProductDTO) => {
    const { userId, productId } = editCartProductDto;
    return await CartModel.findOneAndUpdate(
      { userId, 'items.productId': { $eq: productId } },
      { $pull: { items: { productId } } },
      options,
    );
  };

  public editCartProduct = async (editCartProductDto: EditCartProductDTO) => {
    const { productId, userId, amount } = editCartProductDto;
    return await CartModel.findOneAndUpdate(
      { userId, 'items.productId': { $eq: productId } },
      {
        $set: {
          'items.$.amount': amount,
        },
      },
      { new: true, runValidators: true, upsert: false },
    );
  };
}
