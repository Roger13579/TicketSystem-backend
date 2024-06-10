import { ITicket } from '../../models/ticket';
import { IProduct } from '../../models/product';

export class GetTransferableTicketVo {
  private orderId: string;
  private productName: string;
  private photoPath: string;
  private theater: string;
  private startAt: Date;
  private amount: number;

  constructor(group: ITicket[], product: IProduct) {
    this.orderId = group[0].orderId.toString();
    this.productName = product.title;
    this.photoPath = product.photoPath;
    this.theater = product.theater;
    this.startAt = product.startAt;
    this.amount = group.length - 1;
  }
}
