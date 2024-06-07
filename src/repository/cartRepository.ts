import { Types } from 'mongoose';
import CartModel from '../models/cart';
import { updateOptions } from '../utils/constants';
import {
  EditCartType,
  ICartPagination,
  IEditCartItem,
} from '../types/cart.type';
import { GetCartDTO } from '../dto/cart/getCartDto';
import { createGetCartPipeline } from '../utils/aggregate/cart/getCart.pipeline';

interface IEditItemProps {
  userId: Types.ObjectId;
  item: IEditCartItem;
}

interface IDeleteItemProps {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
}

export class CartRepository {
  public createCart = async (userId: Types.ObjectId) =>
    await CartModel.create({ userId, items: [] });

  /**
   * 取得使用者的購物車，具備分頁功能
   */
  public getCart: (getCartDto: GetCartDTO) => Promise<ICartPagination> = async (
    getCartDto,
  ) => {
    const pipeline = createGetCartPipeline(getCartDto);
    const results = await CartModel.aggregate(pipeline);
    return results[0];
  };

  public findCartByUserId = async (userId: Types.ObjectId) =>
    await CartModel.findOne({ userId });

  public addItem = async ({ item, userId }: IEditItemProps) => {
    const { productId, amount } = item;

    return await CartModel.findOneAndUpdate(
      { userId, 'items.productId': { $ne: productId } },
      { $push: { items: { productId, amount } } },
      updateOptions,
    );
  };

  public clearCart = async (userId: Types.ObjectId) =>
    await CartModel.findOneAndUpdate({ userId }, { items: [] });

  public deleteItem = async ({ userId, productId }: IDeleteItemProps) =>
    await CartModel.findOneAndUpdate(
      { userId, 'items.productId': { $eq: productId } },
      { $pull: { items: { productId } } },
      updateOptions,
    );

  public editItem = async ({ item, userId }: IEditItemProps) => {
    const { productId, amount, type } = item;
    const filter = { userId, 'items.productId': { $eq: productId } };
    const updateAmountQuery = {
      'items.$.amount': amount,
    };
    const update = {
      ...(type === EditCartType.set && { $set: updateAmountQuery }),
      ...(type === EditCartType.inc && { $inc: updateAmountQuery }),
    };
    return await CartModel.findOneAndUpdate(filter, update, {
      ...updateOptions,
      upsert: false,
    });
  };
}
