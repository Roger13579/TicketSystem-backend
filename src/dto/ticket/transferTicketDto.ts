import { Types } from 'mongoose';
import { IClaimShareTicketReq } from '../../types/ticket.type';
import { IUser } from '../../models/user';

export class TransferTicketDTO {
  private readonly _userId: Types.ObjectId;
  private readonly _shareCode: string;

  get userId() {
    return this._userId;
  }

  get shareCode() {
    return this._shareCode;
  }

  constructor(req: IClaimShareTicketReq) {
    const { user, body } = req;

    this._userId = (user as IUser)._id as Types.ObjectId;
    this._shareCode = body.shareCode;
  }
}
