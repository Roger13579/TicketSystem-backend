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
import { EditTicketsDTO } from '../dto/ticket/editTicketsDto';
import { CreateShareCodeDTO } from '../dto/ticket/createShareCodeDto';
import { Types } from 'mongoose';
import * as crypto from 'node:crypto';
import { TransferTicketDTO } from '../dto/ticket/transferTicketDto';
import { GetTicketDetailDto } from '../dto/ticket/getTicketDetailDto';
import { GetSharedTicketsDto } from '../dto/ticket/getSharedTicketsDto';
import { TicketRefundDto } from '../dto/ticket/TicketRefundDto';
import { OrderRepository } from '../repository/orderRepository';
import { ITicket } from '../models/ticket';
import { ProductRepository } from '../repository/productRepository';
import { GetOrderInfoVo } from '../vo/ticket/getOrderInfoVo';
import { IProduct } from '../models/product';

const logger = log4js.getLogger(`TicketService`);

export class TicketService {
  private readonly ticketRepository: TicketRepository = new TicketRepository();
  private readonly orderRepository: OrderRepository = new OrderRepository();
  private readonly productRepository: ProductRepository =
    new ProductRepository();

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
    const holdCount = order.products
      .filter((product) => product.productId.toString() === productId)
      .map((p) => p.amount)[0];
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

  private encryptTicketId = (ticketId: Types.ObjectId) => {
    // 確保密鑰是 32 字節長度 (AES-256)
    const key = crypto
      .createHash('sha256')
      .update(process.env.SHARE_CODE_SECRET_KEY)
      .digest();
    // 初始化向量
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    // 加密
    let encrypted = cipher.update(ticketId.toString(), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    // 返回加密後的 ticket_id 及 iv，兩者用 ':' 分隔
    return `${iv.toString('base64')}:${encrypted}`;
  };

  private decryptShareCode = (shareCode: string) => {
    const parts = shareCode.split(':');
    const iv = Buffer.from(parts[0], 'base64');
    const encrypted = parts[1];
    const key = crypto
      .createHash('sha256')
      .update(process.env.SHARE_CODE_SECRET_KEY)
      .digest();
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  };

  public updateShareCode = async (createShareCodeDto: CreateShareCodeDTO) => {
    const { ticketId } = createShareCodeDto;
    const shareCode = this.encryptTicketId(ticketId);
    createShareCodeDto.shareCode = shareCode;
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
    const ticketId = this.decryptShareCode(shareCode);
    const ticket = await this.ticketRepository.transferTicket(
      transferTicketDto,
      new Types.ObjectId(ticketId),
    );

    if (!ticket) {
      throwError(
        CustomResponseType.TRANSFER_TICKET_ERROR_MESSAGE + '無效的分票驗證碼',
        CustomResponseType.TRANSFER_TICKET_ERROR,
      );
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
