import { IGetFavoritePagination } from '../../types/user.type';

export class GetFavoriteVO {
  public readonly page: number;
  public readonly limit: number;
  public readonly totalCount: number;
  public readonly favorites: unknown[];

  constructor(info: IGetFavoritePagination, page: number, limit: number) {
    this.page = page;
    this.limit = limit;
    this.totalCount = info.totalCount;
    this.favorites = info.favorites;
  }
}
