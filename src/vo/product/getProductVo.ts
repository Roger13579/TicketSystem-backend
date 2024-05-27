import { PaginateOptions, PaginateResult, PaginateDocument } from 'mongoose';
import { IProduct } from '../../models/product';

export class GetProductVo {
  public readonly products: PaginateDocument<
    IProduct,
    NonNullable<unknown>,
    PaginateOptions
  >[];
  public readonly page: number = 1;
  public readonly limit: number = 0;
  public readonly totalCount: number = 0;

  constructor(
    info: PaginateResult<
      PaginateDocument<IProduct, NonNullable<unknown>, PaginateOptions>
    >,
  ) {
    // TODO: return 的格式
    this.products =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      info.docs.map(({ _doc }) => ({
        ..._doc,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        tags: _doc.tags.map(({ _doc }) => ({
          name: _doc.tagId.name,
          _id: _doc._id,
        })),
      })) || [];
    this.page = info.page || 1;
    this.limit = info.limit || 0;
    this.totalCount = info.totalDocs || 0;
  }
}
