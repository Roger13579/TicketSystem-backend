import log4js from '../config/log4js';
import { IOrder, IOrderProduct } from '../models/order';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { TicketRepository } from '../repository/ticketRepository';
import { CreateTicketDto } from '../dto/ticket/createTicketDto';
import { GetTicketsDto } from '../dto/ticket/getTicketsDto';
import { VerifyTicketsDTO } from '../dto/ticket/verifyTicketsDto';
import { EditTicketsDTO } from '../dto/ticket/editTicketsDto';
import { CreateShareCodeDTO } from '../dto/ticket/createShareCodeDto';
import { Types } from 'mongoose';
import { TransferTicketDTO } from '../dto/ticket/transferTicketDto';
import { GetTicketDetailDto } from '../dto/ticket/getTicketDetailDto';
import { GetSharedTicketsDto } from '../dto/ticket/getSharedTicketsDto';
import { TicketRefundDto } from '../dto/ticket/TicketRefundDto';
import { OrderRepository } from '../repository/orderRepository';
import { ITicket } from '../models/ticket';
import { ShareCodeRepository } from '../repository/shareCodeRepository';
import { ProductRepository } from '../repository/productRepository';
import { GetOrderInfoVo } from '../vo/ticket/getOrderInfoVo';
import { IProduct } from '../models/product';

const logger = log4js.getLogger(`TicketService`);

export class TicketService {
  private readonly ticketRepository: TicketRepository = new TicketRepository();
  private readonly orderRepository: OrderRepository = new OrderRepository();
  private readonly shareCodeRepository: ShareCodeRepository =
    new ShareCodeRepository();
  private readonly productRepository: ProductRepository =
    new ProductRepository();

  public findTickets = async (ticketFilterDto: GetTicketsDto) =>
    await this.ticketRepository.findTickets(ticketFilterDto);

  public findSharedTickets = async (
    getSharedTicketsDto: GetSharedTicketsDto,
  ) => {
    return await this.ticketRepository.findSharedTickets(getSharedTicketsDto);
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
  public getTicketDetail = async (getTicketDetailDto: GetTicketDetailDto) => {
    return await this.ticketRepository.getTicketDetail(getTicketDetailDto);
  };

  public getOrderInfo = async (orderId: string, productId: string) => {
    const order = (await this.orderRepository.findById(
      new Types.ObjectId(orderId),
    )) as IOrder;
    const product = (await this.productRepository.findById(
      new Types.ObjectId(productId),
    )) as IProduct;
    const tickets =
      await this.ticketRepository.findTransferableTicketByOrderIdAndProductId(
        order.userId,
        order._id,
        product._id,
      );
    const holdCount = tickets.length;
    return new GetOrderInfoVo(holdCount, product);
  };

  public verifyTickets = async (verifyTicketsDto: VerifyTicketsDTO) => {
    const tickets = await this.ticketRepository.verifyTickets(verifyTicketsDto);

    if (!tickets) {
      throwError(
        CustomResponseType.INVALID_VERIFIED_TICKET_MESSAGE,
        CustomResponseType.INVALID_VERIFIED_TICKET,
      );
      return [];
    }

    return tickets;
  };

  public editTickets = async (editTicketsDto: EditTicketsDTO) => {
    const tickets = await this.ticketRepository.editTickets(editTicketsDto);

    if (!tickets) {
      throwError(
        CustomResponseType.INVALID_EDIT_TICKET_MESSAGE,
        CustomResponseType.INVALID_EDIT_TICKET,
      );
      return [];
    }

    return tickets;
  };

  private checkShareCode = async (shareCode: string) => {
    // 查出驗證碼並用查詢條件判斷是否過期
    const code = await this.shareCodeRepository.findByShareCode(shareCode);
    if (code) {
      return code.ticketId;
    } else {
      throwError(
        CustomResponseType.SHARE_CODE_ERROR_MESSAGE,
        CustomResponseType.SHARE_CODE_ERROR,
      );
    }
  };
  private genShareCode = async (ticketId: Types.ObjectId) => {
    let shareCode;
    let code;
    // 產生後檢查db是否有重複、未到期、未使用的驗證碼
    do {
      shareCode = (Math.floor(Math.random() * 9000000) + 1000000).toString();
      code = await this.shareCodeRepository.findByShareCode(shareCode);
    } while (code);
    await this.shareCodeRepository.create(ticketId, shareCode.toString());
    return shareCode;
  };

  public updateShareCode = async (createShareCodeDto: CreateShareCodeDTO) => {
    const { ticketId } = createShareCodeDto;
    createShareCodeDto.shareCode = await this.genShareCode(ticketId);
    const ticket =
      await this.ticketRepository.updateShareCode(createShareCodeDto);

    if (!ticket) {
      throwError(
        CustomResponseType.TRANSFER_TICKET_CREATE_ERROR_MESSAGE +
          '無法進行分票的票券',
        CustomResponseType.TRANSFER_TICKET_CREATE_ERROR,
      );
    }
    return ticket;
  };

  public transferTicket = async (transferTicketDto: TransferTicketDTO) => {
    const { shareCode } = transferTicketDto;
    const ticketId = (await this.checkShareCode(shareCode)) as Types.ObjectId;
    const ticket = await this.ticketRepository.transferTicket(
      transferTicketDto,
      ticketId,
    );

    if (!ticket) {
      throwError(
        CustomResponseType.TRANSFER_TICKET_ERROR_MESSAGE + '無效的分票驗證碼',
        CustomResponseType.TRANSFER_TICKET_ERROR,
      );
    } else {
      await this.shareCodeRepository.update(ticketId);
    }
    return ticket;
  };

  public deleteTickets = async (ids: string[]) => {
    const tickets = ids.map((id) => ({
      ticketId: new Types.ObjectId(id),
    }));

    const deletedTickets = await this.ticketRepository.deleteTickets(tickets);

    if (!deletedTickets) {
      throwError(
        CustomResponseType.INVALID_TICKET_DELETE_MESSAGE,
        CustomResponseType.INVALID_TICKET_DELETE,
      );
      return [];
    }

    return deletedTickets;
  };

  public ticketRefund = async (ticketRefundDto: TicketRefundDto) => {
    const ticket = await this.ticketRepository.findById(
      ticketRefundDto.ticketId,
    );
    if (!ticket) {
      throwError(
        CustomResponseType.INVALID_TICKET_REFUND_MESSAGE,
        CustomResponseType.INVALID_TICKET_REFUND,
      );
    }
    const order = await this.orderRepository.findById(
      (ticket as ITicket).orderId,
    );
    if (!order) {
      throwError(
        CustomResponseType.INVALID_TICKET_REFUND_MESSAGE,
        CustomResponseType.INVALID_TICKET_REFUND,
      );
    }
    const tickets = await this.ticketRepository.findByOrderId(
      (order as IOrder)._id,
    );
    try {
      await this.ticketRepository.updateRefundTickets(
        tickets.map((ticket) => ticket._id),
        ticketRefundDto.refundReason,
      );
    } catch (err) {
      throwError(
        CustomResponseType.INVALID_TICKET_REFUND_MESSAGE,
        CustomResponseType.INVALID_TICKET_REFUND,
      );
    }
    return tickets;
  };
}
