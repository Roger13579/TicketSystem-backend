import { PaginateDocument, PaginateOptions, PaginateResult } from 'mongoose';
import { ITag } from '../../models/tag';

export class GetTagVo {
  public readonly tags: PaginateDocument<
    ITag,
    NonNullable<unknown>,
    PaginateOptions
  >[] = [];
  public readonly page: number = 1;
  public readonly limit: number = 0;
  public readonly totalCount: number = 0;

  constructor(
    tags: PaginateResult<
      PaginateDocument<ITag, NonNullable<unknown>, PaginateOptions>
    >,
  ) {
    this.tags = tags.docs || [];
    this.page = tags.page || 1;
    this.limit = tags.limit || tags.totalDocs || 0;
    this.totalCount = tags.totalDocs || 0;
  }
}
