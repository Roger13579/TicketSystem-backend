import { Types } from 'mongoose';
import { IUser } from '../../models/user';
import {
  ICreateOrderReq,
  IDeliveryInfo,
  IOrderItem,
  IValidateAmount,
  PaymentMethod,
  PaymentStatus,
} from '../../types/order.type';
import { IOrderProduct } from '../../models/order';

export class CreateOrderDto {
  private readonly userId: Types.ObjectId;
  private products: IOrderProduct[] = [];
  public readonly price: number;
  private readonly paymentMethod: PaymentMethod;
  private readonly paymentStatus: PaymentStatus;
  private readonly deliveryInfo: IDeliveryInfo;
  private readonly _items: IOrderItem[];

  static createValidProduct({ item, product }: IValidateAmount) {
    const { productId, amount, plan } = item;
    const { price, title, brief, type, genre, vendor, theater, plans } =
      product;

    const existedPlan = !!plan
      ? (plans || []).find(
          ({ discount, name, headCount }) =>
            plan.discount === discount &&
            plan.headCount === headCount &&
            plan.name === name,
        )
      : undefined;
    return {
      productId,
      amount,
      price,
      title,
      brief,
      type,
      genre,
      vendor,
      theater,
      ...(existedPlan && { plan: existedPlan }),
    };
  }

  get items() {
    return this._items;
  }

  set setProducts(value: IOrderProduct[]) {
    this.products = value;
  }

  get getProducts() {
    return this.products;
  }
  constructor(req: ICreateOrderReq) {
    const { body, user } = req;
    const { price, items, paymentMethod, deliveryInfo } = body;
    this.userId = new Types.ObjectId((user as IUser).id);
    this.price = price;
    this._items = items;
    this.paymentMethod = paymentMethod;
    this.paymentStatus = PaymentStatus.pending;
    this.deliveryInfo = deliveryInfo;
  }
}
