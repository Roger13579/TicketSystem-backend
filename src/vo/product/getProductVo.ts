import { PaginateOptions, PaginateResult, PaginateDocument } from 'mongoose';
import { IProduct } from '../../models/product';

export class GetProductVo {
  public readonly products: PaginateDocument<
    IProduct,
    NonNullable<unknown>,
    PaginateOptions
  >[];
  public readonly page: number;
  public readonly limit: number;
  public readonly totalCount: number;

  constructor(
    info: PaginateResult<
      PaginateDocument<IProduct, NonNullable<unknown>, PaginateOptions>
    >,
  ) {
    this.products = info.docs;
    this.page = info.page || 1;
    this.limit = info.limit;
    this.totalCount = info.totalDocs;
  }
}
