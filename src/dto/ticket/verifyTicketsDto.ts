import { Types } from 'mongoose';
import {
  IUpdateTicket,
  IVerifyTicketsReq,
  TicketStatus,
} from '../../types/ticket.type';
import { IUser } from '../../models/user';
import moment from 'moment';

export class VerifyTicketsDTO {
  private readonly _tickets: IUpdateTicket[];

  get tickets() {
    return this._tickets;
  }

  constructor(req: IVerifyTicketsReq) {
    const { body, user } = req;
    this._tickets = body.tickets.map(({ productId, userId, ticketId }) => ({
      update: {
        writeOffStaffId: (user as IUser)._id,
        status: TicketStatus.verified,
        writeOffAt: moment().toDate(),
      },
      filter: {
        productId: new Types.ObjectId(productId),
        userId: new Types.ObjectId(userId),
        _id: new Types.ObjectId(ticketId),
        status: TicketStatus.unverified,
        expiredAt: { $gt: moment().toDate() },
      },
      ticketId: new Types.ObjectId(ticketId),
    }));
  }
}
