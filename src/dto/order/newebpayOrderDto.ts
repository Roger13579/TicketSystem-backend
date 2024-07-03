import moment from 'moment';
import { IOrder } from '../../models/order';

export class NewebpayOrderDto {
  get TimeStamp(): number {
    return this._TimeStamp;
  }

  get Amt(): number {
    return this._Amt;
  }

  get MerchantOrderNo(): string {
    return this._MerchantOrderNo;
  }
  get email(): string {
    return this._email;
  }
  get productName(): string {
    return this._productName;
  }
  private readonly _TimeStamp: number;
  private readonly _Amt: number;
  private readonly _MerchantOrderNo: string;
  private readonly _email: string;
  private readonly _productName: string;

  constructor(order: IOrder) {
    this._TimeStamp = Math.round(moment().toDate().getTime() / 1000);
    this._Amt = order.price;
    this._MerchantOrderNo = order.id.toString();
    this._productName = order.products.reduce((accumulator, product) => {
      return accumulator ? `${accumulator}, ${product.title}` : product.title;
    }, '');
    this._email =
      order.deliveryInfo == undefined
        ? 'test@gmail.com'
        : order.deliveryInfo.email;
  }
}
