import { IGetComment, IGetCommentsPagination } from '../../types/comment.type';

export class GetCommentsVo {
  public readonly comments: IGetComment[];
  public readonly page: number;
  public readonly limit: number;
  public readonly totalCount: number;

  constructor(info: IGetCommentsPagination, page: number, limit: number) {
    this.comments = info.comments;
    this.page = page;
    this.limit = limit;
    this.totalCount = info.metadata.totalCount || 0;
  }
}
