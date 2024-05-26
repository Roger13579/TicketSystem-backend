import { Types } from 'mongoose';
import { IUser } from '../../models/user';
import { IEditCartProductReq } from '../../types/cart.type';

export class EditCartProductDTO {
  private readonly _userId: Types.ObjectId;
  private readonly _productId: Types.ObjectId;
  private readonly _amount: number;

  get userId() {
    return this._userId;
  }

  get productId() {
    return this._productId;
  }

  get amount() {
    return this._amount;
  }

  constructor(req: IEditCartProductReq) {
    const { user, body } = req;
    const { amount, productId } = body;
    this._userId = (user as IUser)._id;
    this._amount = amount;
    this._productId = productId;
  }
}
