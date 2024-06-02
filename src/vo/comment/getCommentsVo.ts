import { PaginateDocument, PaginateOptions, PaginateResult } from 'mongoose';
import { IComment } from '../../models/comment';

export class GetCommentsVo {
  public readonly comments: PaginateDocument<
    IComment,
    NonNullable<unknown>,
    PaginateOptions
  >[];
  public readonly page: number;
  public readonly limit: number;
  public readonly totalCount: number;

  constructor(
    info: PaginateResult<
      PaginateDocument<IComment, NonNullable<unknown>, PaginateOptions>
    >,
  ) {
    this.comments = info.docs;
    this.page = info.page || 1;
    this.limit = info.limit;
    this.totalCount = info.totalDocs;
  }
}
