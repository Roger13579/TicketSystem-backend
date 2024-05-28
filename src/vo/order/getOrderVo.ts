import { PaginateOptions, PaginateResult, PaginateDocument } from 'mongoose';
import { IOrder } from '../../models/order';

export class GetOrderVo {
  public readonly orders: PaginateDocument<
    IOrder,
    NonNullable<unknown>,
    PaginateOptions
  >[] = [];
  public readonly page: number = 1;
  public readonly limit: number = 0;
  public readonly totalCount: number = 0;

  constructor(
    orders: PaginateResult<
      PaginateDocument<IOrder, NonNullable<unknown>, PaginateOptions>
    >,
  ) {
    this.orders = orders.docs || [];
    this.page = orders.page || 1;
    this.limit = orders.limit || orders.totalDocs || 0;
    this.totalCount = orders.totalDocs || 0;
  }
}
