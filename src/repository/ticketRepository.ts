import { ITicket, TicketModel } from '../models/ticket';
import { CreateTicketDto } from '../dto/ticket/createTicketDto';
import { PaginateDocument, PaginateOptions, PaginateResult } from 'mongoose';
import { TicketFilterDto } from '../dto/ticket/ticketFilterDto';

export class TicketRepository {
  public async createTicket(createTicketDto: CreateTicketDto) {
    return TicketModel.create(new TicketModel(createTicketDto));
  }

  public findtickets = async (
    ticketFilterDto: TicketFilterDto,
  ): Promise<
    PaginateResult<
      PaginateDocument<ITicket, NonNullable<unknown>, PaginateOptions>
    >
  > => {
    const { page, limit, sortBy } = ticketFilterDto;
    const filter = this.createTicketFilter(ticketFilterDto);
    const options = {
      ...(page && limit && { skip: (page - 1) * limit }),
      ...(limit && { limit }),
      sort: sortBy || '-createdAt',
    };
    return await TicketModel.paginate(filter, options);
  };

  private createTicketFilter(ticketFilterDto: TicketFilterDto) {
    const { status, startAtFrom, startAtTo, isShared } = ticketFilterDto;
    return {
      ...(status && { status: { $eq: status } }),
      ...(isShared && { isShared: { $eq: isShared } }),
      ...((startAtFrom || startAtTo) && {
        startAt: {
          ...(startAtFrom && { $lte: startAtFrom }),
          ...(startAtTo && { $gte: startAtTo }),
        },
      }),
    };
  }
}
