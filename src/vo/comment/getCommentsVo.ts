import { IGetComment, IGetCommentsRes } from '../../types/comment.type';

export class GetCommentsVo {
  public readonly comments: IGetComment[];
  public readonly page: number;
  public readonly limit: number;
  public readonly totalCount: number;

  constructor(info: IGetCommentsRes, page: number, limit: number) {
    this.comments = info.comments;
    this.page = page;
    this.limit = limit;
    this.totalCount = info.metadata[0].totalCount || 0;
  }
}
