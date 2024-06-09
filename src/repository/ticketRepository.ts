import { TicketModel } from '../models/ticket';
import { CreateTicketDto } from '../dto/ticket/createTicketDto';
import { GetTicketsDto } from '../dto/ticket/getTicketsDto';
import { VerifyTicketsDTO } from '../dto/ticket/verifyTicketsDto';
import { Types, startSession } from 'mongoose';
import { updateOptions } from '../utils/constants';
import { CustomResponseType } from '../types/customResponseType';
import { throwError } from '../utils/errorHandler';
import {
  IUpdateTicket,
  IGetTicketsRes,
  UpdateAction,
  TicketStatus,
} from '../types/ticket.type';
import { EditTicketsDTO } from '../dto/ticket/editTicketsDto';
import { CreateShareCodeDTO } from '../dto/ticket/createShareCodeDto';
import { TransferTicketDTO } from '../dto/ticket/transferTicketDto';
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
   * @description 編輯多張票券時，一定要所有票券皆 valid 才可通過
   */
  private updateTickets = async (
    tickets: IUpdateTicket[],
    action: UpdateAction,
  ) => {
    const session = await startSession();
    session.startTransaction();
    try {
      const promises = tickets.map(
        async ({ filter, update }) =>
          await TicketModel.findOneAndUpdate(filter, update, {
            ...updateOptions,
            session,
          }),
      );

      const updatedTickets = await Promise.all(promises).then(
        (values) => values,
      );

      const invalidTickets = tickets.filter(({ ticketId }) => {
        const existedTicket = updatedTickets.find((ticket) => {
          if (!ticket) {
            return false;
          }
          const existedTicketId = new Types.ObjectId(ticket._id as string);
          return existedTicketId.equals(ticketId);
        });
        return !existedTicket;
      });

      if (invalidTickets.length > 0) {
        const message =
          action === UpdateAction.verify
            ? CustomResponseType.INVALID_VERIFIED_TICKET_MESSAGE
            : CustomResponseType.INVALID_EDIT_TICKET_MESSAGE;
        const idsStr = invalidTickets.map(({ ticketId }) => ticketId).join(',');
        // 前端可以用 "//" 抓到 哪些 id 有錯誤
        throw new Error(`${message}//${idsStr}//`);
      }

      await session.commitTransaction();
      return updatedTickets;
    } catch (error) {
      await session.abortTransaction();
      const code =
        action === UpdateAction.verify
          ? CustomResponseType.INVALID_VERIFIED_TICKET
          : CustomResponseType.INVALID_EDIT_TICKET;
      throwError((error as Error).message, code);
    } finally {
      session.endSession();
    }
  };

  public verifyTickets = async ({ tickets }: VerifyTicketsDTO) =>
    await this.updateTickets(tickets, UpdateAction.verify);

  public editTickets = async ({ tickets }: EditTicketsDTO) =>
    await this.updateTickets(tickets, UpdateAction.edit);

  public updateShareCode = async ({
    shareCode,
    ticketId,
    userId,
  }: CreateShareCodeDTO) => {
    const filter = {
      _id: ticketId,
      userId,
      status: TicketStatus.unverified,
      expiredAt: { $gt: moment().toDate() },
    };
    const update = {
      shareCode,
      status: TicketStatus.transfer,
    };
    return await TicketModel.findOneAndUpdate(filter, update, updateOptions);
  };

  public transferTicket = async (
    { shareCode, userId }: TransferTicketDTO,
    ticketId: Types.ObjectId,
  ) => {
    const filter = {
      _id: ticketId,
      status: TicketStatus.transfer,
      expiredAt: { $gt: moment().toDate() },
      shareCode,
      giverId: { $exists: false },
    };

    const ticket = await TicketModel.findOne(filter);

    if (!ticket) {
      return null;
    }

    const update = {
      userId,
      status: TicketStatus.unverified,
      giverId: ticket.userId,
      writeOffAt: moment().toDate(),
    };

    return await TicketModel.findOneAndUpdate(filter, update, updateOptions);
  };
}
