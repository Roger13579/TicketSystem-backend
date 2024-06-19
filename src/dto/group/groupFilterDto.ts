import moment from 'moment/moment';
import {
  GroupSortField,
  GroupStatus,
  IGetGroupsReq,
} from '../../types/group.type';
import { SortOrder } from '../../types/common.type';

export class GroupFilterDto {
  private readonly _title?: string;
  private readonly _movieTitle?: string[];
  private readonly _theater?: string[];
  private readonly _participantCount?: number;
  private readonly _status: GroupStatus;
  private readonly _haveTicket?: boolean;
  private readonly _startAt?: Date;
  private readonly _endAt?: Date;
  private readonly _page: number;
  private readonly _limit: number;
  private readonly _sort: Record<string, 1 | -1>;

  get filter() {
    const titleRegex = this._title ? new RegExp(this._title) : undefined;
    return {
      ...(titleRegex && { title: { $regex: titleRegex } }),
      ...(this._movieTitle && { movieTitle: { $in: this._movieTitle } }),
      ...(this._status && { status: { $eq: this._status } }),
      ...(this._theater && { theater: { $in: this._theater } }),
      ...(this._participantCount && {
        amount: { $eq: this._participantCount },
      }),
      ...(this._haveTicket && { haveTicket: this._haveTicket }),
      ...((this._startAt || this._endAt) && {
        time: {
          ...(this._endAt && { $lte: this._endAt }),
          ...(this._startAt && { $gte: this._startAt }),
        },
      }),
    };
  }

  get options() {
    return {
      page: this._page,
      limit: this._limit,
      sort: this._sort,
      projection: {
        title: 1,
        placeholderImg: 1,
        theater: 1,
        movieTitle: 1,
        status: 1,
        time: 1,
        amount: 1,
        haveTicket: 1,
        content: 1,
      },
    };
  }

  constructor(req: IGetGroupsReq) {
    const {
      title,
      movieTitle,
      theater,
      participantCount,
      status,
      haveTicket,
      startAt,
      endAt,
      page,
      limit,
      sortField,
      sortOrder,
    } = req.query;

    this._sort = {
      [`${sortField || GroupSortField.createdAt}`]:
        sortOrder === SortOrder.asc ? 1 : -1,
    };
    this._title = title;
    this._status = status === undefined ? GroupStatus.ongoing : status;
    this._limit = Number(limit);
    this._page = Number(page);
    this._participantCount = Number(participantCount);
    this._movieTitle = movieTitle ? movieTitle.split(',') : undefined;
    this._theater = theater ? theater.split(',') : undefined;
    this._haveTicket =
      haveTicket === undefined ? undefined : haveTicket === 'true';
    this._startAt = startAt ? moment(startAt).toDate() : undefined;
    this._endAt = endAt ? moment(endAt).toDate() : undefined;
  }
}
