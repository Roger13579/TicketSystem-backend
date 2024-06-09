import { Types } from 'mongoose';
import { ITransferTicketReq } from '../../types/ticket.type';
import { IUser } from '../../models/user';

export class CreateShareCodeDTO {
  private readonly _userId: Types.ObjectId;
  private readonly _ticketId: Types.ObjectId;
  private _shareCode: string = '';

  get shareCode() {
    return this._shareCode;
  }

  set shareCode(value: string) {
    this._shareCode = value;
  }

  get userId() {
    return this._userId;
  }

  get ticketId() {
    return this._ticketId;
  }

  constructor(req: ITransferTicketReq) {
    const { user, body } = req;

    this._userId = new Types.ObjectId((user as IUser)._id as string);
    this._ticketId = new Types.ObjectId(body.ticketId as string);
  }
}
