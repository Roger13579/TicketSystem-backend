import { IProduct } from '../../models/product';

export class GetProductVo {
  private products: IProduct[] = [];
  private page: number = 1;
  private limit: number = 0;
  private totalCount: number = 0;
  constructor(
    info:
      | {
          products: IProduct[];
          totalCount: number;
        }
      | undefined,
    page: number | undefined,
    limit: number | undefined,
  ) {
    this.products = info?.products || [];
    this.page = page || 1;
    this.limit = limit || info?.totalCount || 0;
    this.totalCount = info?.totalCount || 0;
  }
}
