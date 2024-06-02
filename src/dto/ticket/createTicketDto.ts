import { Types } from 'mongoose';
import { IOrderProduct } from '../../models/order';
import { TicketStatus } from '../../types/ticket.type';

export class CreateTicketDto {
  private readonly userId: Types.ObjectId;
  private readonly orderId: Types.ObjectId;
  public readonly productId: Types.ObjectId;
  private readonly amount: number;
  private readonly status: TicketStatus;
  private readonly isPublished: boolean;
  private readonly expiredAt: Date;

  constructor(
    userId: Types.ObjectId,
    orderId: Types.ObjectId,
    orderProduct: IOrderProduct,
  ) {
    this.userId = userId;
    this.orderId = orderId;
    this.productId = orderProduct.productId;
    this.amount = orderProduct.amount;
    this.status = TicketStatus.unverified;
    this.isPublished = false;
    this.expiredAt = orderProduct.startAt;
  }
}
