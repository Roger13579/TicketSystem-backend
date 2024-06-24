import { Types } from 'mongoose';
import { IUserReq } from '../../types/common.type';
import { IUser } from '../../models/user';
import { AccountType } from '../../types/user.type';

export class GetTicketDetailDto {
  private readonly _ticketId: Types.ObjectId;
  private readonly _isAdmin: boolean = false;

  get filter() {
    return {
      _id: this._ticketId,
    };
  }

  get projection() {
    return {
      _id: 1,
      productId: 1,
      userId: 1,
      orderId: 1,
      status: 1,
      isPublished: 1,
      expiredAt: 1,
      shareCode: this._isAdmin ? 1 : -1,
      giverId: this._isAdmin ? 1 : -1,
      title: '$product.title',
      photoPath: '$product.photoPath',
      theater: '$product.theater',
      startAt: '$product.startAt',
      price: '$order.price',
      purchaseAt: '$order.createdAt',
      purchaseAmount: {
        $reduce: {
          input: '$order.products',
          initialValue: 0,
          in: { $add: ['$$value', '$$this.amount'] },
        },
      },
    };
  }
  constructor(req: IUserReq) {
    const { params, user } = req;
    this._ticketId = new Types.ObjectId(params.id);
    if ((user as IUser | undefined)?.accountType === AccountType.admin) {
      this._isAdmin = true;
    }
  }
}
