import moment from 'moment';
import { IGetCommentsReq } from '../../types/comment.type';
import { Status } from '../../types/common.type';
import { AccountType } from '../../types/user.type';
import { IUser } from '../../models/user';
import { Types } from 'mongoose';

export class GetCommentsDTO {
  private readonly _productName?: string;
  private readonly _productIds?: Types.ObjectId[];
  private readonly _limit: number = 10;
  private readonly _page: number = 1;
  private readonly _status?: Status;
  private readonly _ratings?: number[];
  private readonly _createdAtFrom?: Date;
  private readonly _createdAtTo?: Date;
  private readonly _accounts?: string[];
  private readonly _content?: string;
  private readonly _sortBy?: string;
  private readonly _accountType?: AccountType;

  get page() {
    return this._page;
  }

  get productIds() {
    return this._productIds;
  }

  get productName() {
    return this._productName;
  }

  get limit() {
    return this._limit;
  }

  get status() {
    return this._status;
  }

  get ratings() {
    return this._ratings;
  }

  get createdAtFrom() {
    return this._createdAtFrom;
  }
  get createdAtTo() {
    return this._createdAtTo;
  }
  get accounts() {
    return this._accounts;
  }
  get content() {
    return this._content;
  }
  get sortBy() {
    return this._sortBy;
  }

  get accountType() {
    return this._accountType;
  }

  constructor(req: IGetCommentsReq) {
    const {
      productIds,
      productName,
      limit,
      page,
      status,
      ratings,
      createdAtFrom,
      createdAtTo,
      accounts,
      content,
      sortBy,
    } = req.query;

    this._accountType = (req.user as IUser).accountType;

    this._productIds = productIds
      ?.split(',')
      .map((id) => new Types.ObjectId(id));
    this._productName = productName;

    this._limit = limit ? Number(limit) : 10;
    this._sortBy = sortBy;
    this._page = page ? Number(page) : 1;

    this._content = content;
    this._accounts = accounts?.split(',');
    this._ratings = ratings?.split(',').map((item) => Number(item));

    this._status = status === undefined ? status : (status as Status);

    this._createdAtFrom = createdAtFrom
      ? moment(createdAtFrom).toDate()
      : undefined;
    this._createdAtTo = createdAtTo ? moment(createdAtTo).toDate() : undefined;
  }
}
