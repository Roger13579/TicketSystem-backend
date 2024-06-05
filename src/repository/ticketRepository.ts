import { TicketModel } from '../models/ticket';
import { CreateTicketDto } from '../dto/ticket/createTicketDto';
import { GetTicketsDto } from '../dto/ticket/getTicketsDto';

export class TicketRepository {
  public async createTicket(createTicketDto: CreateTicketDto) {
    return TicketModel.create(new TicketModel(createTicketDto));
  }

  public findTickets = async (ticketFilterDto: GetTicketsDto) => {
    const productNameFilter = ticketFilterDto.productNameRegex
      ? {
          'product.title': { $regex: ticketFilterDto.productNameRegex },
        }
      : undefined;
    return TicketModel.aggregate([
      {
        $match: {
          ...ticketFilterDto.filter,
        },
      },
      {
        $lookup: {
          localField: 'productId',
          from: 'products',
          foreignField: '_id',
          as: 'product',
          pipeline: [
            {
              $project: ticketFilterDto.options.productSelect,
            },
          ],
        },
      },
      { $unwind: '$product' },
      {
        $match: {
          ...(ticketFilterDto.productNameRegex && productNameFilter),
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          tickets: [
            { $sort: ticketFilterDto.sort },
            { $skip: (ticketFilterDto.page - 1) * ticketFilterDto.limit },
            {
              $limit: ticketFilterDto.limit,
            },
            { $project: ticketFilterDto.options.ticketSelect },
          ],
        },
      },
      {
        $set: {
          metadata: [
            {
              $cond: {
                if: { $eq: [{ $size: '$metadata' }, 0] },
                then: [{ totalCount: 0 }],
                else: '$metadata',
              },
            },
          ],
        },
      },
      { $unwind: '$metadata' },
    ]);
  };
}
