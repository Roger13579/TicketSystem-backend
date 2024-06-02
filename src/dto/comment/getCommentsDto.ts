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
  private readonly _isAdmin: boolean = false;

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

  get filter() {
    const contentRegex = this._content ? new RegExp(this._content) : undefined;
    return {
      ...(!!this._productIds && { productId: { $in: this._productIds } }),
      ...(this._status && { status: this._status }),
      ...(!!this._ratings && { rating: { $in: this._ratings } }),
      ...(contentRegex && { content: { $regex: contentRegex } }),
      ...(!!this._accounts && { account: { $in: this._accounts } }),
      ...((this._createdAtFrom || this._createdAtTo) && {
        createdAt: {
          ...(this._createdAtFrom && { $lte: this._createdAtFrom }),
          ...(this._createdAtTo && { $gte: this._createdAtTo }),
        },
      }),
    };
  }

  get options() {
    const projection = {
      _id: 1,
      rating: 1,
      content: 1,
      createdAt: 1,
      status: this._isAdmin ? 1 : -1, // admin 才能看到 status
      user: {
        ...(this._isAdmin && { _id: '$user._id' }),
        account: '$user.account',
        avatarPath: '$user.avatarPath',
        name: '$user.name',
      },
      productId: 1,
    };
    return {
      sort: this._sortBy,
      skip: (this._page - 1) * this._limit,
      limit: this._limit,
      projection,
    };
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

    if (req.user && (req.user as IUser).accountType === AccountType.admin) {
      this._isAdmin = true;
    }

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
