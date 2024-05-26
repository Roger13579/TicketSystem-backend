import OrderModel, { IOrder } from '../models/order';
import { CreateOrderDto } from '../dto/order/createOrderDto';
import { Types } from 'mongoose';

export class OrderRepository {
  public async createOrder(createOrderDto: CreateOrderDto): Promise<IOrder> {
    return OrderModel.create(new OrderModel(createOrderDto));
  }
  public async findById(orderId: Types.ObjectId): Promise<IOrder | null> {
    return OrderModel.findOne({ _id: orderId });
  }
  public async updateOrder(
    orderId: Types.ObjectId,
    thirdPartyPaymentId: string,
  ): Promise<IOrder | null> {
    return OrderModel.findOneAndUpdate(
      { _id: orderId },
      {
        thirdPartyPaymentId: thirdPartyPaymentId,
      },
    );
  }
}
