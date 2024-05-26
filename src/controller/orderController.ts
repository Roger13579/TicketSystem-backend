import { Request } from 'express';
import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { UserDetailVo } from '../vo/userDetailVo';
import { OrderService } from "../service/orderService";

class OrderController extends BaseController {
  private readonly orderService = new OrderService();

  public createOrder = async (req: IOrderReq): Promise<ResponseObject> => {
    const user = (await this.orderService.createOrder(
      payload.account,
    )) as IOrder;
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new UserDetailVo(user),
    );
  };

  public newebpayNotify = async (req: Request): Promise<ResponseObject> => {
    return this.orderService.
  };
}

export default OrderController;
