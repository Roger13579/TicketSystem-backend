import { Request } from 'express';
import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { OrderService } from '../service/orderService';
import { ICreateOrderReq, PaymentMethod } from '../types/order.type';
import { CreateOrderDto } from '../dto/order/createOrderDto';

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
}

export default OrderController;
