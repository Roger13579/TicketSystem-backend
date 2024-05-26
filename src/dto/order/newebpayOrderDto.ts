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
  private readonly _TimeStamp: number;
  private readonly _Amt: number;
  private readonly _MerchantOrderNo: string;
  private readonly _email: string;

  constructor(order: IOrder) {
    this._TimeStamp = Math.round(new Date().getTime() / 1000);
    this._Amt = order.price;
    this._MerchantOrderNo = order.id.toString();
    this._email =
      order.deliveryInfo == undefined
        ? 'test@gmail.com'
        : order.deliveryInfo.email;
  }
}