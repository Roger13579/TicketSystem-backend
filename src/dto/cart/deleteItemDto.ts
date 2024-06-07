import { Types } from 'mongoose';

import { IUser } from '../../models/user';
import { DeleteCartType, IDeleteCartReq } from '../../types/cart.type';
import { uniq } from 'lodash';

export class DeleteItemDTO {
  private readonly _userId: Types.ObjectId;
  private readonly _productIds?: Types.ObjectId[];
  private readonly _type: DeleteCartType;

  get userId() {
    return this._userId;
  }

  get productIds() {
    return this._productIds;
  }

  get type() {
    return this._type;
  }

  constructor(req: IDeleteCartReq) {
    const { user, body } = req;
    this._userId = new Types.ObjectId((user as IUser)._id as string);

    this._productIds = uniq(body.productIds || []).map(
      (id) => new Types.ObjectId(id),
    );
    this._type = body.type;
  }
}
