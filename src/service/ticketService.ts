import log4js from '../config/log4js';
import { IOrder, IOrderProduct } from '../models/order';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { areTimesInOrder } from '../utils/common';
import { TicketRepository } from '../repository/ticketRepository';
import { CreateTicketDto } from '../dto/ticket/createTicketDto';
import { GetTicketsDto } from '../dto/ticket/getTicketsDto';
import { SortOrder } from '../types/common.type';
import { VerifyTicketsDTO } from '../dto/ticket/verifyTicketsDto';

const logger = log4js.getLogger(`TicketService`);

export class TicketService {
  private readonly ticketRepository: TicketRepository = new TicketRepository();

  public findTickets = async (ticketFilterDto: GetTicketsDto) => {
    const { expiredAtFrom, expiredAtTo } = ticketFilterDto;

    // 確認時間順序
    areTimesInOrder(
      [
        { name: 'expiredAtFrom', value: expiredAtFrom },
        { name: 'expiredAtTo', value: expiredAtTo },
      ],
      SortOrder.asc,
    );

    return await this.ticketRepository.findTickets(ticketFilterDto);
  };

  public async createTickets(order: IOrder) {
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

  public verifyTickets = async (verifyTicketsDto: VerifyTicketsDTO) =>
    await this.ticketRepository.verifyTickets(verifyTicketsDto);
}
