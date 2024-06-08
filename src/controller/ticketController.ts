import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { TicketService } from '../service/ticketService';
import { GetTicketsDto } from '../dto/ticket/getTicketsDto';
import { IGetTicketsReq, IVerifyTicketsReq } from '../types/ticket.type';
import { IOrder } from '../models/order';
import { OrderRepository } from '../repository/orderRepository';
import { GetTicketVo } from '../vo/ticket/getTicketVo';
import { VerifyTicketsDTO } from '../dto/ticket/verifyTicketsDto';
import { TMethod } from '../types/common.type';

export class TicketController extends BaseController {
  private readonly ticketService = new TicketService();
  private readonly orderRepository = new OrderRepository();

  // 測試建立票券用
  public createTicket: TMethod = async (req) => {
    const { orderId } = req.body;
    const order = (await this.orderRepository.findById(orderId)) as IOrder;
    await this.ticketService.createTickets(order);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };

  public getTickets: TMethod<IGetTicketsReq> = async (req) => {
    const getTicketsDto = new GetTicketsDto(req);
    const { page, limit } = getTicketsDto;
    const info = await this.ticketService.findTickets(getTicketsDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetTicketVo(info, page, limit),
    );
  };

  public verifyTickets: TMethod<IVerifyTicketsReq> = async (req) => {
    const verifyTicketsDto = new VerifyTicketsDTO(req);
    const infos = await this.ticketService.verifyTickets(verifyTicketsDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { infos },
    );
  };
}
