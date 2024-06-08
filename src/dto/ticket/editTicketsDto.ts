import { Types } from 'mongoose';
import {
  IUpdateTicket,
  IEditTicketsReq,
  TicketStatus,
} from '../../types/ticket.type';
import moment from 'moment';

export class EditTicketsDTO {
  private readonly _tickets: IUpdateTicket[];

  get tickets() {
    return this._tickets;
  }

  private statusFilter(status: TicketStatus) {
    // status => unverified，原本是 pending
    // status => refunded，原本是 pending、unverified
    // status => cancelled，原本是 pending、unverified
    // status => expired，原本是 pending、unverified
    // status => pending，原本是 unverified
    switch (status) {
      case TicketStatus.unverified:
        return { status: TicketStatus.pending };
      case TicketStatus.pending:
        return { status: TicketStatus.unverified };
      case TicketStatus.refunded:
      case TicketStatus.cancelled:
        return {
          status: { $in: [TicketStatus.pending, TicketStatus.unverified] },
        };
      case TicketStatus.expired:
        return {
          status: { $in: [TicketStatus.pending, TicketStatus.unverified] },
          expiredAt: { $lt: moment().toDate() },
        };
      default:
        return {};
    }
  }

  private isPublishedFilter(isPublished: boolean) {
    // 要被上架的票券一定要是沒被使用的正常狀態票券
    return isPublished ? { status: TicketStatus.unverified } : {};
  }

  constructor(req: IEditTicketsReq) {
    this._tickets = req.body.tickets.map(
      ({ ticketId, status, isPublished, expiredAt }) => ({
        ticketId: new Types.ObjectId(ticketId),
        filter: {
          ...(status !== undefined && this.statusFilter(status)),
          ...(isPublished !== undefined && this.isPublishedFilter(isPublished)),
          _id: new Types.ObjectId(ticketId),
        },
        update: {
          ...(status !== undefined && { status }),
          ...(isPublished !== undefined && { isPublished }),
          ...(expiredAt !== undefined && { expiredAt }),
        },
      }),
    );
  }
}
