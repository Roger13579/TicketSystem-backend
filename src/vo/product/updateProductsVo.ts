import { IProduct } from '../../models/product';
import { IInvalidProduct } from '../../types/product.type';

export class UpdateProductsVO {
  public readonly products: IProduct[];
  public readonly errors: IInvalidProduct[];

  constructor(infos: (IInvalidProduct | IProduct)[]) {
    const invalidProducts: IInvalidProduct[] = [];
    const products: IProduct[] = [];

    infos.forEach((info) => {
      if ('subStatus' in info) {
        invalidProducts.push(info as IInvalidProduct);
      } else {
        products.push(info);
      }
    });

    this.errors = invalidProducts;
    this.products = products;
  }
}
