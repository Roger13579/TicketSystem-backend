import { IGetTagsReq, TagSortBy } from '../../types/tag.type';

export class GetTagsDTO {
  private readonly _page: number;
  private readonly _limit: number;
  private readonly _name: string;

  get name() {
    return this._name;
  }

  get filter() {
    return { ...(this._name && { name: { $regex: new RegExp(this._name) } }) };
  }

  get options() {
    return {
      skip: (this._page - 1) * this._limit,
      ...(this._limit && { limit: this._limit }),
      sortBy: `-${TagSortBy.createdAt}`, // TODO:把最常用的顯示在上面
    };
  }

  constructor(req: IGetTagsReq) {
    const { limit, page, name } = req.query;

    this._limit = isNaN(Number(limit)) ? 10 : Number(limit);
    this._page = isNaN(Number(page)) ? 1 : Number(page);
    this._name = name || '';
  }
}
