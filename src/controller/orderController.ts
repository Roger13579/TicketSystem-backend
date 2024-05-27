import { Request } from 'express';
import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { OrderService } from '../service/orderService';
import {
  ICreateOrderReq,
  IGetOrdersReq,
  PaymentMethod,
} from '../types/order.type';
import { CreateOrderDto } from '../dto/order/createOrderDto';
import { OrderFilterDto } from '../dto/order/orderFilterDto';
import { GetOrderVo } from '../vo/order/getOrderVo';

class OrderController extends BaseController {
  private readonly orderService = new OrderService();

  public createOrder = async (
    req: ICreateOrderReq,
  ): Promise<ResponseObject> => {
    const createOrderDto = new CreateOrderDto(req);
    const order = await this.orderService.createOrder(createOrderDto);
    switch (order.paymentMethod) {
      case PaymentMethod.newebPay:
        const newebpayOrderVo = await this.orderService.newebpayProcess(order);
        return this.formatResponse(
          CustomResponseType.OK_MESSAGE,
          CustomResponseType.OK,
          newebpayOrderVo,
        );
      default:
        return this.formatResponse(
          CustomResponseType.OK_MESSAGE,
          CustomResponseType.OK,
        );
    }
  };

  public newebpayNotify = async (req: Request): Promise<ResponseObject> => {
    await this.orderService.checkOrder(req);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };

  public getOrders = async (req: IGetOrdersReq): Promise<ResponseObject> => {
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
