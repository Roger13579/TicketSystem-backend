import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { OrderService } from '../service/orderService';
import {
  ICreateOrderReq,
  IGetOrdersReq,
  ILinePayConfirmReq,
  INewebPayCheckOrderReq,
  PaymentMethod,
} from '../types/order.type';
import { CreateOrderDto } from '../dto/order/createOrderDto';
import { OrderFilterDto } from '../dto/order/orderFilterDto';
import { GetOrderVo } from '../vo/order/getOrderVo';
import { throwError } from '../utils/errorHandler';
import { LinePayConfirmDTO } from '../dto/order/linePayConfirmDto';
import { TMethod } from '../types/common.type';
import { TicketService } from '../service/ticketService';
import { CartService } from '../service/cartService';

class OrderController extends BaseController {
  private readonly orderService = new OrderService();
  private readonly ticketService = new TicketService();
  private readonly cartService = new CartService();

  public createOrder: TMethod<ICreateOrderReq> = async (req) => {
    const createOrderDto = new CreateOrderDto(req);
    const order = await this.orderService.createOrder(createOrderDto);
    switch (order.paymentMethod) {
      case PaymentMethod.newebPay:
        const newebpayOrderVo = await this.orderService.newebpayProcess(order);
        return this.formatResponse(
          CustomResponseType.OK_MESSAGE,
          CustomResponseType.OK,
          { [PaymentMethod.newebPay]: newebpayOrderVo },
        );
      case PaymentMethod.linePay:
        const linePayOrderVo = await this.orderService.linePayProcess(order);
        return this.formatResponse(
          CustomResponseType.OK_MESSAGE,
          CustomResponseType.OK,
          { [PaymentMethod.linePay]: linePayOrderVo },
        );
      default:
        return this.formatResponse(
          CustomResponseType.OK_MESSAGE,
          CustomResponseType.OK,
        );
    }
  };

  public newebpayNotify: TMethod<INewebPayCheckOrderReq> = async (req) => {
    const order = await this.orderService.newebPayCheckOrder(req);
    if (!order) {
      throwError(
        CustomResponseType.NEWEBPAY_ERROR_MESSAGE,
        CustomResponseType.NEWEBPAY_ERROR,
      );
    } else {
      await this.cartService.clearCart(order.userId);
      await this.ticketService.createTickets(order);
    }
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      order,
    );
  };

  public newebpayRedirect = async () => {
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      {
        specific_redirect_url: process.env.PAYMENT_SUCCESS_REDIRECT_URL,
      },
    );
  };

  /**
   * @description 使用者付款後 line 會到這個 url
   */
  public linePayConfirmNotify: TMethod<ILinePayConfirmReq> = async (req) => {
    const linePayConfirmDto = new LinePayConfirmDTO(req);
    const order =
      await this.orderService.linePayConfirmOrder(linePayConfirmDto);

    if (!order) {
      throwError(
        CustomResponseType.LINEPAY_ERROR_MESSAGE,
        CustomResponseType.LINEPAY_ERROR,
      );
    } else {
      await this.cartService.clearCart(order.userId);
      await this.ticketService.createTickets(order);
    }
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      {
        specific_redirect_url: process.env.PAYMENT_SUCCESS_REDIRECT_URL,
      },
    );
  };

  // TODO: 取消交易
  public linePayCancelNotify: TMethod = async () => {
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      {
        specific_redirect_url: process.env.MOVIE_GO_URL,
      },
    );
  };

  public getOrders: TMethod<IGetOrdersReq> = async (req) => {
    const orderFilterDto = new OrderFilterDto(req);
    const info = await this.orderService.findOrders(orderFilterDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetOrderVo(info),
    );
  };
}

export default OrderController;
