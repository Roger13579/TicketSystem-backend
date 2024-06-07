import { Types } from 'mongoose';
import { IUser } from '../../models/user';
import { IEditCartItem, IEditCartReq } from '../../types/cart.type';

export class EditCartDTO {
  private readonly _userId: Types.ObjectId;
  private readonly _products: IEditCartItem[];

  get userId() {
    return this._userId;
  }

  get products() {
    return this._products;
  }

  constructor(req: IEditCartReq) {
    const { user, body } = req;
    const { products } = body;
    this._userId = (user as IUser)._id;
    this._products = products.map((product) => ({
      ...product,
      productId: new Types.ObjectId(product.productId),
    }));
  }
}
