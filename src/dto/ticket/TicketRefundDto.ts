import { Types } from 'mongoose';
import { ITicketRefundReq } from '../../types/ticket.type';

export class TicketRefundDto {
  private readonly _ticketId: Types.ObjectId;
  private readonly _refundReason: string;

  get ticketId(): Types.ObjectId {
    return this._ticketId;
  }

  get refundReason(): string {
    return this._refundReason;
  }

  constructor(req: ITicketRefundReq) {
    const { ticketId, reason } = req.body;
    this._ticketId = new Types.ObjectId(ticketId);
    this._refundReason = reason;
  }
}
