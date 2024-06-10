import { Types } from 'mongoose';
import { ISellTicketReq } from '../../types/ticket.type';
import { IUser } from '../../models/user';

export class SellTicketDto {
  private readonly _userId: Types.ObjectId;
  private readonly _orderId: Types.ObjectId;
  private readonly _productId: Types.ObjectId;
  private readonly _sellAmount: number;

  get userId(): Types.ObjectId {
    return this._userId;
  }

  get orderId(): Types.ObjectId {
    return this._orderId;
  }

  get productId(): Types.ObjectId {
    return this._productId;
  }

  get sellAmount(): number {
    return this._sellAmount;
  }

  constructor(req: ISellTicketReq) {
    const { orderId, productId, amount } = req.body;
    this._userId = (req.user as IUser)._id as Types.ObjectId;
    this._orderId = new Types.ObjectId(orderId);
    this._productId = new Types.ObjectId(productId);
    this._sellAmount = amount;
  }
}
