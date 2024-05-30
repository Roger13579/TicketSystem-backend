import { Request } from 'express';
import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { OrderService } from '../service/orderService';
import {
  ICreateOrderReq,
  IGetOrdersReq,
  ILinePayConfirmReq,
  PaymentMethod,
} from '../types/order.type';
import { CreateOrderDto } from '../dto/order/createOrderDto';
import { OrderFilterDto } from '../dto/order/orderFilterDto';
import { GetOrderVo } from '../vo/order/getOrderVo';
import { throwError } from '../utils/errorHandler';
import { LinePayConfirmDTO } from '../dto/order/linePayConfirmDto';

class OrderController extends BaseController {
  private readonly orderService = new OrderService();

  public createOrder = async (req: ICreateOrderReq) => {
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

  public newebpayNotify = async (req: Request) => {
    const order = await this.orderService.newebPayCheckOrder(req);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { order },
    );
  };

  public linePayConfirmNotify = async (req: ILinePayConfirmReq) => {
    const linePayConfirmDto = new LinePayConfirmDTO(req);
    const order =
      await this.orderService.linePayConfirmOrder(linePayConfirmDto);

    if (!order) {
      throwError(
        CustomResponseType.LINEPAY_ERROR_MESSAGE,
        CustomResponseType.LINEPAY_ERROR + 'B',
      );
    }

    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { order },
    );
  };

  // 取消付款

  // 退款

  public getOrders = async (req: IGetOrdersReq) => {
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
