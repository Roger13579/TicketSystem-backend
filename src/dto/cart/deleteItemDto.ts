import { Types } from 'mongoose';

import { IUser } from '../../models/user';
import {
  DeleteCartType,
  IDeleteCartItem,
  IDeleteCartReq,
} from '../../types/cart.type';
import { uniq } from 'lodash';

export class DeleteItemDTO {
  private readonly _userId: Types.ObjectId;
  private readonly _items: IDeleteCartItem[];
  private readonly _type: DeleteCartType;

  get userId() {
    return this._userId;
  }

  get items() {
    return this._items;
  }

  get type() {
    return this._type;
  }

  constructor(req: IDeleteCartReq) {
    const { user, body } = req;
    this._userId = new Types.ObjectId((user as IUser)._id as string);

    this._items = uniq(body.products || []).map(({ productId, plan }) => ({
      productId: new Types.ObjectId(productId),
      plan,
    }));
    this._type = body.type;
  }
}
