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
    return await TicketModel.paginate(
      ticketFilterDto.filter,
      ticketFilterDto.options,
    );
  };
}
