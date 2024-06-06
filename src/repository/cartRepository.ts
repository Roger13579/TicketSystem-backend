import { Types } from 'mongoose';
import CartModel from '../models/cart';
import { EditCartDTO } from '../dto/cart/editCartDto';
import { updateOptions } from '../utils/constants';
import { EditCartType } from '../types/cart.type';
import { GetCartDTO } from '../dto/cart/getCartDto';
import { DeleteItemDTO } from '../dto/cart/deleteItemDto';
import { createGetCartPipeline } from '../utils/aggregate/cart/getCart.pipeline';

export class CartRepository {
  public createCart = async (userId: Types.ObjectId) => {
    return await CartModel.create({ userId, items: [] });
  };

  /**
   * 取得使用者的購物車，具備分頁功能
   */
  public getCart = async (getCartDto: GetCartDTO) => {
    const pipeline = createGetCartPipeline(getCartDto);
    const carts = await CartModel.aggregate(pipeline);
    return carts[0];
  };

  public findCartByUserId = async (userId: Types.ObjectId) => {
    return await CartModel.findOne({ userId });
  };

  public addItem = async (editCartDto: EditCartDTO) => {
    const { userId, productId, amount } = editCartDto;
    return await CartModel.findOneAndUpdate(
      { userId, 'items.productId': { $ne: productId } },
      { $push: { items: { productId, amount } } },
      updateOptions,
    );
  };

  public deleteItem = async ({
    userId,
    productId,
  }: DeleteItemDTO | EditCartDTO) => {
    return await CartModel.findOneAndUpdate(
      { userId, 'items.productId': { $eq: productId } },
      { $pull: { items: { productId } } },
      updateOptions,
    );
  };

  public editCart = async (editCartDto: EditCartDTO) => {
    const { productId, userId, amount, type } = editCartDto;
    return await CartModel.findOneAndUpdate(
      { userId, 'items.productId': { $eq: productId } },
      {
        ...(type === EditCartType.set && {
          $set: {
            'items.$.amount': amount,
          },
        }),
        ...(type === EditCartType.inc && {
          $inc: {
            'items.$.amount': amount,
          },
        }),
      },
      { new: true, runValidators: true, upsert: false },
    );
  };
}
