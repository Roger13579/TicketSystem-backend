import { GroupSortField } from '../../types/group.type';
import { SortOrder } from '../../types/common.type';
import { Request } from 'express';
import { IUser } from '../../models/user';

export class GetUserGroupDto {
  private readonly _user: IUser;
  private readonly _groupType: string;
  private readonly _page: number;
  private readonly _limit: number;
  private readonly _sort: Record<string, 1 | -1>;

  get groupType(): string {
    return this._groupType;
  }

  get user(): IUser {
    return this._user;
  }

  get ownFilter() {
    return {
      ...(this._user && { userId: { $eq: this._user._id } }),
    };
  }

  get ownOptions() {
    return {
      page: this._page,
      limit: this._limit,
      sort: this._sort,
    };
  }

  get joinedOptions() {
    return {
      page: this._page,
      limit: this._limit,
      sort: this._sort,
    };
  }

  constructor(req: Request) {
    const { page, limit, sortField, sortOrder, groupType } = req.query;

    this._sort = {
      [`${sortField || GroupSortField.createdAt}`]:
        sortOrder === SortOrder.asc ? 1 : -1,
    };
    this._limit = Number(limit);
    this._page = Number(page);
    this._user = req.user as IUser;
    this._groupType = groupType as string;
  }
}
