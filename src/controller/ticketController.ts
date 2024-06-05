import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { Request } from 'express';
import { TicketService } from '../service/ticketService';
import { GetTicketsDto } from '../dto/ticket/getTicketsDto';
import { IGetTicketsReq } from '../types/ticket.type';
import { IOrder } from '../models/order';
import { OrderRepository } from '../repository/orderRepository';
import { GetTicketVo } from '../vo/ticket/getTicketVo';

export class TicketController extends BaseController {
  private readonly ticketService = new TicketService();
  private readonly orderRepository = new OrderRepository();

  // 測試建立票券用
  public createTicket = async (req: Request) => {
    const { orderId } = req.body;
    const order = (await this.orderRepository.findById(orderId)) as IOrder;
    await this.ticketService.createTickets(order);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };

  public getTickets = async (req: IGetTicketsReq) => {
    const getTicketsDto = new GetTicketsDto(req);
    const { page, limit } = getTicketsDto;
    const info = await this.ticketService.findTickets(getTicketsDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetTicketVo(info[0], page, limit),
    );
  };
}
