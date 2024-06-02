import { Types } from 'mongoose';
import { ICart } from '../../models/cart';
import { ICartPagination } from '../../types/cart.type';
import { Document } from 'mongoose';

export class GetCartVO {
  public readonly _id: Types.ObjectId;
  public readonly page: number;
  public readonly limit: number;
  public readonly totalCount: number;
  public readonly userId: Types.ObjectId;
  public readonly items: unknown[];

  constructor(
    cart:
      | ICartPagination
      | (Document<unknown, Record<string, never>, ICart> &
          ICart & {
            _id: Types.ObjectId;
          }),
    page: number,
    limit: number,
  ) {
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
