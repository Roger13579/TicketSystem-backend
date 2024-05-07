import { IProduct } from '../models/product';
import { TCreateProductsReq } from '../types/product.type';

export class NewProductDto {
  private readonly products: IProduct[];

  get getNewProducts(): IProduct[] {
    return this.products;
  }

  constructor(req: TCreateProductsReq) {
    this.products = req.body.products.map((product) => ({
      ...product,
      soldAmount: 0,
    }));
  }
}
