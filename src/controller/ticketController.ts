import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { TicketService } from '../service/ticketService';
import { GetTicketsDto } from '../dto/ticket/getTicketsDto';
import {
  IGetTicketsReq,
  IVerifyTicketsReq,
  IEditTicketsReq,
  ITransferTicketReq,
  IClaimShareTicketReq,
  IDeleteTicketsReq,
  IGetOrderInfoReq,
} from '../types/ticket.type';
import { IOrder } from '../models/order';
import { OrderRepository } from '../repository/orderRepository';
import { GetTicketVo } from '../vo/ticket/getTicketVo';
import { VerifyTicketsDTO } from '../dto/ticket/verifyTicketsDto';
import { IUserReq, TMethod } from '../types/common.type';
import { EditTicketsDTO } from '../dto/ticket/editTicketsDto';
import { CreateShareCodeDTO } from '../dto/ticket/createShareCodeDto';
import { TransferTicketDTO } from '../dto/ticket/transferTicketDto';
import { GetTicketDetailDto } from '../dto/ticket/getTicketDetailDto';
import { GetSharedTicketsDto } from '../dto/ticket/getSharedTicketsDto';

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

  public getSharedTickets: TMethod<IGetTicketsReq> = async (req) => {
    const getSharedTicketsDto = new GetSharedTicketsDto(req);
    const { page, limit } = getSharedTicketsDto;
    const info =
      await this.ticketService.findSharedTickets(getSharedTicketsDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetTicketVo(info, page, limit),
    );
  };

  public getTicketDetail = async (req: IUserReq) => {
    const getTicketsDto = new GetTicketDetailDto(req);
    const ticket = await this.ticketService.getTicketDetail(getTicketsDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      ticket[0],
    );
  };

  public verifyTickets: TMethod<IVerifyTicketsReq> = async (req) => {
    const verifyTicketsDto = new VerifyTicketsDTO(req);
    const tickets = await this.ticketService.verifyTickets(verifyTicketsDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { tickets },
    );
  };

  public editTickets: TMethod<IEditTicketsReq> = async (req) => {
    const editTicketsDto = new EditTicketsDTO(req);
    const tickets = await this.ticketService.editTickets(editTicketsDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { tickets },
    );
  };

  public createShareCode: TMethod<ITransferTicketReq> = async (req) => {
    const createShareCodeDto = new CreateShareCodeDTO(req);
    const ticket = await this.ticketService.updateShareCode(createShareCodeDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      ticket,
    );
  };

  public transferTicket: TMethod<IClaimShareTicketReq> = async (req) => {
    const transferTicketDto = new TransferTicketDTO(req);
    const ticket = await this.ticketService.transferTicket(transferTicketDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      ticket,
    );
  };

  public deleteTickets: TMethod<IDeleteTicketsReq> = async (req) => {
    const tickets = await this.ticketService.deleteTickets(req.body.ticketIds);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { tickets },
    );
  };

  public getTicketOrderInfo: TMethod<IGetOrderInfoReq> = async (req) => {
    const getOrderInfoVo = await this.ticketService.getOrderInfo(
      req.query.orderId!,
      req.query.productId!,
    );
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      getOrderInfoVo,
    );
  };
}
