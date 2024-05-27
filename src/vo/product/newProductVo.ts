import { IProduct } from '../../models/product';

export class NewProductVo {
  public readonly products: IProduct[];
  constructor(products: IProduct[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.products = products.map(({ _doc }) => ({
      ..._doc,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      tags: _doc.tags.map(({ _doc }) => ({
        tagId: _doc._id,
      })),
    })) as IProduct[];
  }
}
