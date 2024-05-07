import { IProduct } from '../models/product';

export class NewProductVo {
  private products: IProduct[];
  constructor(products: IProduct[]) {
    this.products = products;
  }
}
