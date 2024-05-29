import { Types } from 'mongoose';
import { IUser } from '../../models/user';
import { ICreateOrderReq, PaymentStatus } from '../../types/order.type';
import { IProductSnapshot } from '../../types/product.type';

export class CreateOrderDto {
  private readonly userId: Types.ObjectId;
  private readonly products: [IProductSnapshot];
  private readonly price: string;
  private readonly paymentMethod: string;
  private readonly paymentStatus: string;
  private readonly paidAt: Date;
  private readonly deliveryInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };

  get getProducts() {
    return this.products;
  }
  constructor(req: ICreateOrderReq) {
    this.userId = new Types.ObjectId((req.user as IUser).id);
    this.products = req.body.products;
    this.price = req.body.price;
    this.paymentMethod = req.body.paymentMethod;
    this.paymentStatus = PaymentStatus.pending;
    this.paidAt = req.body.paidAt;
    this.deliveryInfo = req.body.deliveryInfo;
  }
}
