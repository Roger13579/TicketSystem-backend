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
import { groupBy, sumBy, find, isMatch } from 'lodash';

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
    const {
      price,
      title,
      brief,
      type,
      genre,
      vendor,
      theater,
      plans,
      startAt,
    } = product;

    const existedPlan = plan
      ? find(plans || [], (p) =>
          isMatch(p, {
            discount: plan.discount,
            name: plan.name,
            headCount: plan.headCount,
          }),
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
      startAt,
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
    this._items = Object.values(groupBy(items, 'productId')).map((group) => ({
      productId: group[0].productId,
      amount: sumBy(group, 'amount'),
    }));
    this.paymentMethod = paymentMethod;
    this.paymentStatus = PaymentStatus.pending;
    this.deliveryInfo = deliveryInfo;
  }
}
