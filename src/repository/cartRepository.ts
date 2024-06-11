import { Types } from 'mongoose';
import CartModel from '../models/cart';
import { updateOptions } from '../utils/constants';
import {
  EditCartType,
  ICartProduct,
  ICartPagination,
  IDeleteItemParams,
  IEditItemParams,
} from '../types/cart.type';
import { GetCartDTO } from '../dto/cart/getCartDto';
import { createGetCartPipeline } from '../utils/aggregate/cart/getCart.pipeline';

export class CartRepository {
  private itemElemMath = ({ productId, plan }: ICartProduct) => ({
    productId,
    ...(plan && {
      'plan.discount': plan.discount,
      'plan.name': plan.name,
      'plan.headCount': plan.headCount,
    }),
  });

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

  public addItem = async ({ item, userId }: IEditItemParams) => {
    const { productId, amount, plan } = item;

    const filter = {
      userId,
      items: {
        $not: {
          $elemMatch: this.itemElemMath(item),
        },
      },
    };

    const update = { $push: { items: { productId, amount, plan } } };

    return await CartModel.findOneAndUpdate(filter, update, updateOptions);
  };

  public clearCart = async (userId: Types.ObjectId) =>
    await CartModel.findOneAndUpdate({ userId }, { items: [] });

  public deleteItem = async (props: IDeleteItemParams) => {
    const { userId, item } = props;
    const filter = {
      userId,
      items: {
        $elemMatch: this.itemElemMath(item),
      },
    };
    return await CartModel.findOneAndUpdate(
      filter,
      {
        $pull: {
          items: {
            productId: item.productId,
            'plan.discount': item.plan.discount,
            'plan.headCount': item.plan.headCount,
            'plan.name': item.plan.name,
          },
        },
      },
      updateOptions,
    );
  };

  public editItem = async ({ item, userId }: IEditItemParams) => {
    const { amount, type } = item;
    const filter = {
      userId,
      items: {
        $elemMatch: this.itemElemMath(item),
      },
    };
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
