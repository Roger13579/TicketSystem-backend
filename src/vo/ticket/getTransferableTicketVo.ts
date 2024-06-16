import { ITicket } from '../../models/ticket';
import { IProduct } from '../../models/product';

export class GetTransferableTicketVo {
  private orderId: string;
  private productId: string;
  private productName: string;
  private photoPath: string;
  private theater: string;
  private startAt: Date;
  private expiredAt: Date;
  private amount: number;

  constructor(group: ITicket[], product: IProduct) {
    this.orderId = group[0].orderId.toString();
    this.productId = product._id.toString();
    this.productName = product.title;
    this.photoPath = product.photoPath;
    this.theater = product.theater;
    this.startAt = product.startAt;
    this.expiredAt = group[0].expiredAt;
    this.amount = group.length - 1;
  }
}
