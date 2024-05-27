import { IProduct } from '../../models/product';
import { ICreateProductsReq } from '../../types/product.type';

export class CreateProductDTO {
  private readonly _products: (Omit<IProduct, 'tags'> & {
    tagNames: string[];
  })[];
  private readonly _tagNames: string[];

  get tagNames() {
    return this._tagNames;
  }

  get products() {
    return this._products;
  }

  constructor(req: ICreateProductsReq) {
    const { products } = req.body;
    this._tagNames = products.map(({ tagNames }) => tagNames).flat();

    this._products = products.map((item) => {
      const { tagNames } = item;
      return {
        ...item,
        tagNames,
      };
    });
  }
}
