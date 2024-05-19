import moment from 'moment/moment';
import { GroupStatus, IGetGroupsReq } from '../../types/group.type';
import { IUser } from '../../models/user';
import { Types } from 'mongoose';

export class GroupFilterDto {
  private readonly _title?: string;
  private readonly _movieTitle?: string[];
  private readonly _theater?: string[];
  private readonly _participantCount?: number;
  private readonly _status: string;
  private readonly _hasTicket?: boolean;
  private readonly _startAt?: Date;
  private readonly _endAt?: Date;
  private readonly _page: number;
  private readonly _limit: number;
  private readonly _sortBy?: string;
  private readonly _userId: Types.ObjectId | undefined;

  get title() {
    return this._title;
  }

  get movieTitle() {
    return this._movieTitle;
  }

  get theater() {
    return this._theater;
  }

  get participantCount() {
    return this._participantCount;
  }
  get status() {
    return this._status;
  }

  get hasTicket() {
    return this._hasTicket;
  }
  get startAt() {
    return this._startAt;
  }
  get endAt() {
    return this._endAt;
  }

  get page() {
    return this._page;
  }

  get limit() {
    return this._limit;
  }

  get sortBy() {
    return this._sortBy;
  }

  get userId() {
    return this._userId;
  }

  constructor(req: IGetGroupsReq) {
    const {
      title,
      movieTitle,
      theater,
      participantCount,
      status,
      hasTicket,
      startAt,
      endAt,
      page,
      limit,
      sortBy,
    } = req.query;

    this._sortBy = sortBy;
    this._title = title;
    this._status = status === undefined ? GroupStatus.ongoing : status;
    this._limit = Number(limit);
    this._page = Number(page);
    this._participantCount = Number(participantCount);
    this._movieTitle = movieTitle?.split(',');
    this._theater = theater?.split(',');
    this._hasTicket =
      hasTicket === undefined ? undefined : hasTicket === 'true';
    this._startAt = startAt ? moment(startAt).toDate() : undefined;
    this._endAt = endAt ? moment(endAt).toDate() : undefined;
    this._userId = req.user !== undefined ? (req.user as IUser).id : undefined;
  }
}
