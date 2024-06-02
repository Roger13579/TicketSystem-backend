import { OrderModel } from '../models/order';
import { CreateOrderDto } from '../dto/order/createOrderDto';
import { Types } from 'mongoose';
import { OrderFilterDto } from '../dto/order/orderFilterDto';
import { IUpdateOrderParam } from '../types/order.type';

export class OrderRepository {
  public async createOrder(createOrderDto: CreateOrderDto) {
    return OrderModel.create(new OrderModel(createOrderDto));
  }
  public async findById(orderId: Types.ObjectId) {
    return OrderModel.findOne({ _id: orderId });
  }
  public async updateOrder({
    orderId,
    thirdPartyPaymentId,
    paymentStatus,
    paidAt,
  }: IUpdateOrderParam) {
    return OrderModel.findOneAndUpdate(
      { _id: orderId },
      {
        thirdPartyPaymentId,
        paymentStatus,
        ...(paidAt && { paidAt }),
      },
    );
  }
  public findOrders = async ({ options, filter }: OrderFilterDto) =>
    await OrderModel.paginate(filter, options);
}
