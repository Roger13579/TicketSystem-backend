import { ITicket, TicketModel } from '../models/ticket';
import { CreateTicketDto } from '../dto/ticket/createTicketDto';
import { GetTicketsDto } from '../dto/ticket/getTicketsDto';
import { VerifyTicketsDTO } from '../dto/ticket/verifyTicketsDto';
import { Types, startSession } from 'mongoose';
import { updateOptions } from '../utils/constants';
import { CustomResponseType } from '../types/customResponseType';
import { throwError } from '../utils/errorHandler';
import {
  IGetTicketsRes,
  ITicketId,
  TicketProcess,
  TicketStatus,
} from '../types/ticket.type';
import { EditTicketsDTO } from '../dto/ticket/editTicketsDto';
import { CreateShareCodeDTO } from '../dto/ticket/createShareCodeDto';
import { TransferTicketDTO } from '../dto/ticket/transferTicketDto';
import moment from 'moment';
import { createGetTicketPipeline } from '../utils/aggregate/ticket/getTickets.pipeline';
import { GetTicketDetailDto } from '../dto/ticket/getTicketDetailDto';
import { createGetTicketDetailPipeline } from '../utils/aggregate/ticket/getTicketDetail.pipeline';

export class TicketRepository {
  public async createTicket(createTicketDto: CreateTicketDto) {
    return TicketModel.create(new TicketModel(createTicketDto));
  }

  public findTickets = async (
    ticketFilterDto: GetTicketsDto,
  ): Promise<IGetTicketsRes> => {
    const pipeline = createGetTicketPipeline(ticketFilterDto);
    const results = await TicketModel.aggregate(pipeline);
    return results[0];
  };

  public getTicketDetail = async (getTicketDetailDto: GetTicketDetailDto) => {
    const pipeline = createGetTicketDetailPipeline(getTicketDetailDto);
    return TicketModel.aggregate(pipeline);
  };

  public deleteTickets = async (tickets: ITicketId[]) => {
    const session = await startSession();
    try {
      const result = await session.withTransaction(async () => {
        const promises = tickets.map(
          async (id) =>
            await TicketModel.findOneAndDelete(
              { _id: id },
              { ...updateOptions, session },
            ),
        );
        const deletedTickets = await Promise.all(promises).then(
          (values) => values,
        );

        this.checkInvalidTicket(tickets, deletedTickets, TicketProcess.delete);

        return deletedTickets;
      });

      return result;
    } catch (error) {
      throwError(
        (error as Error).message,
        CustomResponseType.INVALID_TICKET_DELETE,
      );
    } finally {
      session.endSession();
    }
  };

  public verifyTickets = async ({ tickets }: VerifyTicketsDTO) => {
    const session = await startSession();

    try {
      const result = await session.withTransaction(async () => {
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

        this.checkInvalidTicket(tickets, updatedTickets, TicketProcess.verify);

        return updatedTickets;
      });
      return result;
    } catch (error) {
      throwError(
        (error as Error).message,
        CustomResponseType.INVALID_VERIFIED_TICKET,
      );
    } finally {
      session.endSession();
    }
  };

  public editTickets = async ({ tickets }: EditTicketsDTO) => {
    const session = await startSession();

    try {
      const result = await session.withTransaction(async () => {
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

        this.checkInvalidTicket(tickets, updatedTickets, TicketProcess.edit);

        return updatedTickets;
      });
      return result;
    } catch (error) {
      throwError(
        (error as Error).message,
        CustomResponseType.INVALID_EDIT_TICKET,
      );
    } finally {
      session.endSession();
    }
  };

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

  private checkInvalidTicket = (
    tickets: ITicketId[],
    dbTickets: (ITicket | null)[],
    process: TicketProcess,
  ) => {
    const invalidTickets = tickets.filter(({ ticketId }) => {
      const existedTicket = dbTickets.find((ticket) => {
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
      const error = new Error();
      if (process === TicketProcess.delete) {
        error.message = `${CustomResponseType.INVALID_TICKET_DELETE_MESSAGE}//${idsStr}//`;
      }
      if (process === TicketProcess.edit) {
        error.message = `${CustomResponseType.INVALID_EDIT_TICKET_MESSAGE}//${idsStr}//`;
      }
      if (process === TicketProcess.verify) {
        error.message = `${CustomResponseType.INVALID_VERIFIED_TICKET_MESSAGE}//${idsStr}//`;
      }

      throw error;
    }
  };
}
