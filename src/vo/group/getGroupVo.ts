import { IGroup } from '../../models/group';
import { PaginateDocument, PaginateOptions, PaginateResult } from 'mongoose';

export class GetGroupVo {
  private groups: PaginateDocument<
    IGroup,
    NonNullable<unknown>,
    PaginateOptions
  >[] = [];
  private page: number = 1;
  private limit: number = 0;
  private totalCount: number = 0;

  constructor(
    groups: PaginateResult<
      PaginateDocument<IGroup, NonNullable<unknown>, PaginateOptions>
    >,
  ) {
    this.groups = groups.docs || [];
    this.page = groups.page || 1;
    this.limit = groups.limit || groups.totalDocs || 0;
    this.totalCount = groups.totalDocs || 0;
  }
}
