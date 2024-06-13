import { Types } from 'mongoose';
import { ICart } from '../../models/cart';
import { ICartPagination } from '../../types/cart.type';

export class GetCartVO {
  public readonly _id: Types.ObjectId;
  public readonly page: number;
  public readonly limit: number;
  public readonly totalCount: number;
  public readonly userId: Types.ObjectId;
  public readonly items: unknown[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(cart: ICartPagination | ICart, limit: number, page: number) {
    this.createdAt = cart.createdAt;
    this.updatedAt = cart.updatedAt;
    this._id = cart._id;
    this.page = page;
    this.limit = limit;
    this.totalCount = (cart as ICartPagination).totalCount
      ? (cart as ICartPagination).totalCount
      : 0;
    this.userId = cart.userId;
    this.items = cart.items;
  }
}
