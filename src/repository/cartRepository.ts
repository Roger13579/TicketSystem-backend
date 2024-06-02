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
      { $match: { userId } }, // filter comment
      { $unwind: '$items' }, // 把 items 分組 => 根據 array 的每個 item 去拆分成個別文檔
      {
        $lookup: {
          localField: 'items.productId', // 針對 items.product
          from: 'products', // 到 products 這個 collection
          foreignField: '_id', // 去尋找裡面 product document 的 _id 相符的
          as: 'product', // 新增為 product 這個 property (內容為 array)
        },
      },
      {
        $unwind: '$product', // 把上面和 products collection 所取得 product 分組
      },
      { $match: { 'product.isPublic': true } }, // filter product => 會取得符合的 array of product
      {
        $group: {
          // 重新回傳整理內容
          _id: '$_id',
          userId: { $first: '$userId' }, // $first 代表分組後的第一個資料
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
          // 要留下哪些資料
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
