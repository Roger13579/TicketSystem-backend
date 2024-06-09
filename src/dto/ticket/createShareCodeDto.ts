import { FilterQuery, Types } from 'mongoose';
import { ITransferTicketReq, TicketStatus } from '../../types/ticket.type';
import { IUser } from '../../models/user';
import { ITicket } from '../../models/ticket';
import moment from 'moment';

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

  get availableFilter(): FilterQuery<ITicket> {
    return {
      _id: this._ticketId,
      userId: this._userId,
      status: TicketStatus.unverified,
      expiredAt: { $gt: moment().toDate() },
    };
  }

  constructor(req: ITransferTicketReq) {
    const { user, body } = req;

    this._userId = new Types.ObjectId((user as IUser)._id as string);
    this._ticketId = new Types.ObjectId(body.ticketId as string);
  }
}
