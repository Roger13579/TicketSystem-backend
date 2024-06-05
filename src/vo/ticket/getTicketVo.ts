import { IGetTicket, IGetTicketsRes } from '../../types/ticket.type';

export class GetTicketVo {
  private tickets: IGetTicket[];
  private page: number;
  private limit: number;
  private totalCount: number;

  constructor(info: IGetTicketsRes, page: number, limit: number) {
    this.tickets = info.tickets || [];
    this.page = page || 1;
    this.limit = limit;
    this.totalCount = info.metadata[0].totalCount || 0;
  }
}
