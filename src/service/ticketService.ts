import log4js from '../config/log4js';
import { IOrder, IOrderProduct } from '../models/order';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { PaginateDocument, PaginateOptions, PaginateResult } from 'mongoose';
import { checkDateOrder } from '../utils/common';
import { TicketRepository } from '../repository/ticketRepository';
import { CreateTicketDto } from '../dto/ticket/createTicketDto';
import { TicketFilterDto } from '../dto/ticket/ticketFilterDto';
import { ITicket } from '../models/ticket';

const logger = log4js.getLogger(`TicketService`);

export class TicketService {
  private readonly ticketRepository: TicketRepository = new TicketRepository();

  public findTickets = async (
    ticketFilterDto: TicketFilterDto,
  ): Promise<
    PaginateResult<
      PaginateDocument<ITicket, NonNullable<unknown>, PaginateOptions>
    >
  > => {
    const { expiredAtFrom, expiredAtTo } = ticketFilterDto;

    // 確認時間順序
    checkDateOrder(
      { prop: 'expiredAtFrom', value: expiredAtFrom },
      { prop: 'expiredAtTo', value: expiredAtTo },
    );

    return await this.ticketRepository.findtickets(ticketFilterDto);
  };

  public async createTickets(order: IOrder): Promise<void> {
    const orderProducts = order.products.reduce(
      (acc: IOrderProduct[], item: IOrderProduct) => {
        const repeatedItems: IOrderProduct[] = Array.from(
          { length: item.amount },
          () => ({
            ...item,
            productId: item.productId,
            startAt: item.startAt,
            amount: 1,
          }),
        );
        return acc.concat(repeatedItems);
      },
      [],
    );
    try {
      for (const orderProduct of orderProducts) {
        await this.ticketRepository.createTicket(
          new CreateTicketDto(order.userId, order.id, orderProduct),
        );
      }
    } catch (err) {
      logger.error('create ticket error', err);
      throwError(
        CustomResponseType.INSERT_ERROR_MESSAGE,
        CustomResponseType.INSERT_ERROR,
      );
    }
  }
}
