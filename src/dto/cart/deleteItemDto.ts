import { Types } from 'mongoose';
import { IUserReq } from '../../types/common.type';
import { IUser } from '../../models/user';

export class DeleteItemDTO {
  private readonly _userId: Types.ObjectId;
  private readonly _productId: Types.ObjectId;

  get userId() {
    return this._userId;
  }

  get productId() {
    return this._productId;
  }

  constructor(req: IUserReq) {
    const { params, user } = req;
    this._userId = new Types.ObjectId((user as IUser)._id as string);
    this._productId = new Types.ObjectId(params.productId);
  }
}
