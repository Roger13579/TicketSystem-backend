import { PaginateDocument, PaginateOptions, PaginateResult } from 'mongoose';
import { ITicket } from '../../models/ticket';

export class GetTicketVo {
  private tickets: PaginateDocument<
    ITicket,
    NonNullable<unknown>,
    PaginateOptions
  >[] = [];
  private page: number;
  private limit: number;
  private totalCount: number;

  constructor(
    tickets: PaginateResult<
      PaginateDocument<ITicket, NonNullable<unknown>, PaginateOptions>
    >,
  ) {
    this.tickets = tickets.docs || [];
    this.page = tickets.page || 1;
    this.limit = tickets.limit || tickets.totalDocs || 0;
    this.totalCount = tickets.totalDocs || 0;
  }
}
