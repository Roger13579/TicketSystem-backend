import { Types } from 'mongoose';
import { IGetUserFavoriteReq } from '../../types/user.type';
import { IUser } from '../../models/user';

export class GetUserFavoriteDTO {
  readonly _page: number;
  readonly _limit: number;
  readonly _userId: Types.ObjectId;

  get userId() {
    return this._userId;
  }

  get limit() {
    return this._limit;
  }

  get page() {
    return this._page;
  }

  constructor(req: IGetUserFavoriteReq) {
    const { query, user } = req;
    const { limit, page } = query;
    this._userId = new Types.ObjectId((user as IUser)._id as string);
    this._limit = Number(limit);
    this._page = Number(page);
  }
}
