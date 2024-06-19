import { IOrder } from '../../models/order';
import {
  LinePayPackage,
  IShippingAddress,
  ILinePayRequestBody,
  LinePayCurrency,
  LinePayLocale,
} from '../../types/line.type';

export class LinePayOrderDTO {
  private readonly _amount: number;
  private readonly _orderId: string;
  private readonly _packages: LinePayPackage[];
  private readonly _address?: IShippingAddress;

  get orderId() {
    return this._orderId;
  }

  get body(): ILinePayRequestBody {
    return {
      amount: this._amount,
      currency: LinePayCurrency.TWD,
      orderId: this._orderId,
      packages: this._packages,
      redirectUrls: {
        confirmUrl: `${process.env.LINEPAY_RETURN_HOST}${process.env.LINEPAY_RETURN_CONFIRM_URL}`,
        cancelUrl: `${process.env.LINEPAY_RETURN_HOST}${process.env.LINEPAY_RETURN_CANCEL_URL}`,
      },
      options: {
        display: {
          locale: LinePayLocale.zh_TW,
        },
        shipping: {
          address: this._address,
        },
      },
    };
  }
  constructor(order: IOrder) {
    const { price, _id, products, deliveryInfo } = order;
    this._amount = price;
    this._orderId = _id.toString();
    this._packages = [
      {
        id: _id.toString(),
        amount: price,
        name: 'Movie Go',
        products: products.map(({ productId, title, amount, plan, price }) => ({
          id: productId.toString(),
          name: title,
          quantity: amount,
          price: price * plan.headCount * plan.discount,
          originalPrice: price * plan.headCount,
        })),
      },
    ];

    this._address = {
      detail: deliveryInfo?.address,
      recipient: {
        firstName: deliveryInfo?.name,
        email: deliveryInfo?.email,
        phoneNo: deliveryInfo?.phone,
      },
    };
  }
}
