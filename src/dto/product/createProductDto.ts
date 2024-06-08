import { uniq } from 'lodash';
import { IProduct } from '../../models/product';
import { ICreateProductsReq } from '../../types/product.type';
import { ITagId } from '../../models/baseModel';

export class CreateProductDTO {
  private readonly _products: (Omit<IProduct, 'tags'> & {
    tags?: ITagId[];
    tagNames?: string[];
  })[];
  private readonly _tagNames?: string[];

  get tagNames() {
    return this._tagNames;
  }

  get products() {
    return this._products;
  }

  constructor(req: ICreateProductsReq) {
    const { products } = req.body;
    const tagNameList = uniq(
      products.map(({ tagNames }) => tagNames || []).flat(),
    );

    this._tagNames = tagNameList;

    this._products = products;
  }
}
