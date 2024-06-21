import { IProduct } from '../../models/product';

export class GetOrderInfoVo {
  private productName: string;
  private photoPath: string;
  private holdCount: number;
  private price: number;

  constructor(holdCount: number | undefined, product: IProduct) {
    this.productName = product.title;
    this.photoPath = product.photoPath;
    this.holdCount = holdCount != undefined ? holdCount : 0;
    this.price = product.price;
  }
}
