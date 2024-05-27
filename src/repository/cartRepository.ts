import { Types } from 'mongoose';
import CartModel from '../models/cart';
import { EditCartProductDTO } from '../dto/cart/editCartProductDto';
import { updateOptions } from '../utils/constants';

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
      updateOptions,
    );
  };

  public deleteCartProduct = async (editCartProductDto: EditCartProductDTO) => {
    const { userId, productId } = editCartProductDto;
    return await CartModel.findOneAndUpdate(
      { userId, 'items.productId': { $eq: productId } },
      { $pull: { items: { productId } } },
      updateOptions,
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
