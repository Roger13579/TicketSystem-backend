import { IOrder, OrderModel } from '../models/order';
import { CreateOrderDto } from '../dto/order/createOrderDto';
import {
  PaginateDocument,
  PaginateOptions,
  PaginateResult,
  Types,
} from 'mongoose';
import { OrderFilterDto } from '../dto/order/orderFilterDto';
import { PaymentStatus } from '../types/order.type';

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
        paymentStatus: PaymentStatus.paid,
      },
    );
  }
  public findOrders = async (
    orderFilterDto: OrderFilterDto,
  ): Promise<
    PaginateResult<
      PaginateDocument<IOrder, NonNullable<unknown>, PaginateOptions>
    >
  > => {
    const { page, limit, sortBy } = orderFilterDto;
    const filter = this.createOrderFilter(orderFilterDto);
    const options = {
      //TODO 確認populate是否生效
      populate: { path: 'user', select: 'account name phone email' },
      ...(page && limit && { skip: (page - 1) * limit }),
      ...(limit && { limit }),
      sort: sortBy || '-createdAt',
    };
    return await OrderModel.paginate(filter, options);
  };

  private createOrderFilter(orderFilterDto: OrderFilterDto) {
    const {
      status,
      ids,
      thirdPartyPaymentIds,
      accounts,
      emails,
      createdAtFrom,
      createdAtTo,
      phones,
      paidAtFrom,
      paidAtTo,
    } = orderFilterDto;
    return {
      ...(status && { status: { $eq: status } }),
      ...(ids && { _id: { $in: ids } }),
      ...(thirdPartyPaymentIds && {
        thirdPartyPaymentId: { $in: thirdPartyPaymentIds },
      }),
      ...(accounts && { account: { $in: accounts } }),
      ...(emails && { deliveryInfo: { email: { $in: emails } } }),
      ...((createdAtFrom || createdAtTo) && {
        startAt: {
          ...(createdAtFrom && { $lte: createdAtFrom }),
          ...(createdAtTo && { $gte: createdAtTo }),
        },
      }),
      ...((paidAtFrom || paidAtTo) && {
        sellStartAt: {
          ...(paidAtFrom && { $lte: paidAtFrom }),
          ...(paidAtTo && { $gte: paidAtTo }),
        },
      }),
      ...(phones && { deliveryInfo: { phone: { $in: phones } } }),
    };
  }
}
