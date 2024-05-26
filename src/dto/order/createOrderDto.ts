import { Types } from 'mongoose';
import { IUser } from '../../models/user';
import { ICreateOrderReq } from '../../types/order.type';
import { IProductSnapshot } from '../../types/product.type';

export class CreateOrderDto {
  private readonly _userId: Types.ObjectId;
  private readonly _products: [IProductSnapshot];
  private readonly _price: string;
  private readonly _paymentMethod: string;
  private readonly _paidAt: Date;
  private readonly _deliveryInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };

  constructor(req: ICreateOrderReq) {
    this._userId = new Types.ObjectId((req.user as IUser).id);
    this._products = req.body.products;
    this._price = req.body.price;
    this._paymentMethod = req.body.paymentMethod;
    this._paidAt = req.body.paidAt;
    this._deliveryInfo = req.body.deliveryInfo;
  }

  get userId(): Types.ObjectId {
    return this._userId;
  }

  get products(): [IProductSnapshot] {
    return this._products;
  }

  get price(): string {
    return this._price;
  }

  get paymentMethod(): string {
    return this._paymentMethod;
  }

  get paidAt(): Date {
    return this._paidAt;
  }

  get deliveryInfo(): {
    name: string;
    address: string;
    phone: string;
    email: string;
  } {
    return this._deliveryInfo;
  }
}
