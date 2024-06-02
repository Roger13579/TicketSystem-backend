import { Types } from 'mongoose';
import { IUserReq } from '../../types/common.type';
import { IUser } from '../../models/user';
import { AccountType } from '../../types/user.type';
import {
  defaultProjection,
  detailProjection,
} from '../../utils/product.constants';

export class GetProductDetailDTO {
  private readonly _productId: Types.ObjectId;
  private readonly _isAdmin: boolean = false;

  get filter() {
    return {
      _id: this._productId,
      ...(!this._isAdmin && { isPublic: true }), // admin 不用 isPublic
    };
  }

  get projection() {
    return {
      ...defaultProjection,
      ...detailProjection,
      recommendWeight: this._isAdmin ? 1 : 0, // admin
      isPublic: this._isAdmin ? 1 : 0, // admin
    };
  }

  constructor(req: IUserReq) {
    const { params, user } = req;
    this._productId = new Types.ObjectId(params.id);
    if ((user as IUser | undefined)?.accountType === AccountType.admin) {
      this._isAdmin = true;
    }
  }
}
