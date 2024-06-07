import { TicketModel } from '../models/ticket';
import { CreateTicketDto } from '../dto/ticket/createTicketDto';
import { GetTicketsDto } from '../dto/ticket/getTicketsDto';
import { VerifyTicketsDTO } from '../dto/ticket/verifyTicketsDto';
import { Types, startSession } from 'mongoose';
import { updateOptions } from '../utils/constants';
import { CustomResponseType } from '../types/customResponseType';
import { throwError } from '../utils/errorHandler';
import { IGetTicketsRes, TicketStatus } from '../types/ticket.type';
import moment from 'moment';

export class TicketRepository {
  public async createTicket(createTicketDto: CreateTicketDto) {
    return TicketModel.create(new TicketModel(createTicketDto));
  }

  public findTickets = async (
    ticketFilterDto: GetTicketsDto,
  ): Promise<IGetTicketsRes> => {
    const productNameFilter = ticketFilterDto.productNameRegex
      ? {
          'product.title': { $regex: ticketFilterDto.productNameRegex },
        }
      : undefined;

    const results = await TicketModel.aggregate([
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
    return results[0];
  };

  /**
   * @description 驗證多張票券時，一定要所有票券皆 valid 才可通過
   */
  public verifyTickets = async ({ tickets, staffId }: VerifyTicketsDTO) => {
    const session = await startSession();

    session.startTransaction();

    try {
      const promises = tickets.map(
        async ({ productId, userId, amount, ticketId }) =>
          await TicketModel.findOneAndUpdate(
            {
              productId,
              userId,
              amount,
              _id: ticketId,
              status: TicketStatus.unverified,
              expiredAt: { $gt: moment().toDate() },
            },
            {
              writeOffStaffId: staffId,
              status: TicketStatus.verified,
              writeOffAt: moment().toDate(),
            },
            { ...updateOptions, session },
          ),
      );

      const verifiedTickets = await Promise.all(promises).then(
        (values) => values,
      );

      const invalidTickets = tickets.filter(({ ticketId }) => {
        const existedTicket = verifiedTickets.find((ticket) => {
          if (!ticket) {
            return false;
          }
          const existedTicketId = new Types.ObjectId(ticket._id as string);
          return existedTicketId.equals(ticketId);
        });
        return !existedTicket;
      });

      if (invalidTickets.length > 0) {
        const idsStr = invalidTickets.map(({ ticketId }) => ticketId).join(',');
        throw new Error(
          CustomResponseType.INVALID_VERIFIED_TICKET_MESSAGE + idsStr,
        );
      }

      await session.commitTransaction();
      return verifiedTickets;
    } catch (error) {
      await session.abortTransaction();
      throwError(
        (error as Error).message,
        CustomResponseType.INVALID_VERIFIED_TICKET,
      );
    } finally {
      session.endSession();
    }
  };
}
