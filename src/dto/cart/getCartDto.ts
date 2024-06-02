import { Types } from 'mongoose';
import { IGetCartReq } from '../../types/cart.type';
import { IUser } from '../../models/user';

export class GetCartDTO {
  private readonly _userId: Types.ObjectId;
  private readonly _limit: number = 10;
  private readonly _page: number = 1;

  get userId() {
    return this._userId;
  }

  get limit() {
    return this._limit;
  }

  get page() {
    return this._page;
  }

  constructor(req: IGetCartReq) {
    const { query, user } = req;
    const { limit, page } = query;

    this._userId = new Types.ObjectId((user as IUser)._id as string);
    this._limit = Number(limit);
    this._page = Number(page);
  }
}
