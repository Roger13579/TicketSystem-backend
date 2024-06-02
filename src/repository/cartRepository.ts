import { Types } from 'mongoose';
import CartModel from '../models/cart';
import { EditCartProductDTO } from '../dto/cart/editCartProductDto';
import { updateOptions } from '../utils/constants';
import { EditCartType } from '../types/cart.type';
import { GetCartDTO } from '../dto/cart/getCartDto';

export class CartRepository {
  public createCart = async (userId: Types.ObjectId) => {
    return await CartModel.create({ userId, items: [] });
  };

  /**
   * 取得使用者的購物車，具備分頁功能
   */
  public getCart = async ({ userId, page, limit }: GetCartDTO) =>
    await CartModel.aggregate([
      { $match: { userId } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      { $match: { 'product.isPublic': true } },
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$userId' },
          items: {
            $push: {
              product: {
                _id: '$product._id',
                title: '$product.title',
                type: '$product.type',
                genre: '$product.genre',
                price: '$product.price',
                soldAmount: '$product.soldAmount',
                amount: '$product.amount',
                isLaunched: '$product.isLaunched',
                photoPath: '$product.photoPath',
                sellStartAt: '$product.sellStartAt',
                sellEndAt: '$product.sellEndAt',
              },
              amount: '$items.amount',
              createdAt: '$items.createdAt',
              updatedAt: '$items.updatedAt',
            },
          },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          totalCount: { $size: '$items' },
          items: {
            $slice: ['$items', (page - 1) * limit, limit],
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

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
    const { productId, userId, amount, type } = editCartProductDto;
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
