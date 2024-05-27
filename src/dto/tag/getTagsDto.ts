import { IGetTagsReq } from '../../types/tag.type';

export class GetTagsDTO {
  private readonly _page: number;
  private readonly _limit: number;
  private readonly _name: string;

  get page() {
    return this._page;
  }

  get limit() {
    return this._limit;
  }

  get name() {
    return this._name;
  }

  constructor(req: IGetTagsReq) {
    const { limit, page, name } = req.query;

    this._limit = isNaN(Number(limit)) ? 10 : Number(limit);
    this._page = isNaN(Number(page)) ? 1 : Number(page);
    this._name = name || '';
  }
}
