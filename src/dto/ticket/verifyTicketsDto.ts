import { Types } from 'mongoose';
import { IVerifyTicket, IVerifyTicketsReq } from '../../types/ticket.type';
import { IUser } from '../../models/user';

export class VerifyTicketsDTO {
  private readonly _tickets: IVerifyTicket[];
  private readonly _staffId: Types.ObjectId;

  get staffId() {
    return this._staffId;
  }

  get tickets() {
    return this._tickets;
  }

  constructor(req: IVerifyTicketsReq) {
    const { body, user } = req;

    this._staffId = (user as IUser)._id;
    this._tickets = body.tickets.map(
      ({ productId, userId, ticketId, amount }) => ({
        productId: new Types.ObjectId(productId),
        userId: new Types.ObjectId(userId),
        ticketId: new Types.ObjectId(ticketId),
        amount,
      }),
    );
  }
}
