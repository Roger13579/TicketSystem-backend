import moment from 'moment/moment';
import { IGetTicketsReq, TicketStatus } from '../../types/ticket.type';
import { OrderSortBy } from '../../types/order.type';
import { Types } from 'mongoose';
import { IUser } from '../../models/user';
import { AccountType } from '../../types/user.type';

export class TicketFilterDto {
  private readonly _status?: TicketStatus;
  private readonly _userId?: Types.ObjectId | undefined;
  private readonly _expiredAtFrom?: Date;
  private readonly _expiredAtTo?: Date;
  private readonly _isPublished?: boolean;
  private readonly _page: number;
  private readonly _limit: number;
  private readonly _sortBy?: string;
  private readonly _ids?: string[];
  private readonly _productName?: string;
  private readonly isAdmin?: boolean;

  get status() {
    return this._status;
  }

  get expiredAtFrom() {
    return this._expiredAtFrom;
  }

  get expiredAtTo() {
    return this._expiredAtTo;
  }

  get isPublished() {
    return this._isPublished;
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

  get ids() {
    return this._ids;
  }
  get productName() {
    return this._productName;
  }
  get userId() {
    return this._userId;
  }
  // TODO 研究如何加上 productName 條件
  get filter() {
    return {
      ...(this._status && { status: { $eq: this._status } }),
      ...(this._userId && { userId: { $eq: this._userId } }),
      ...(this._ids && { _id: { $in: this._ids } }),
      ...((this._expiredAtFrom || this._expiredAtTo) && {
        startAt: {
          ...(this._expiredAtFrom && { $lte: this._expiredAtFrom }),
          ...(this._expiredAtTo && { $gte: this._expiredAtTo }),
        },
      }),
      ...(this._isPublished && { isPublished: { $eq: this._isPublished } }),
    };
  }
  get options() {
    const selectStr = this.isAdmin
      ? 'title photoPath price theater startAt isPublic recommendWeight'
      : 'title photoPath price theater startAt -isPublic -recommendWeight';
    const projection = this.isAdmin
      ? {}
      : {
          writeOffAt: 0,
          writeOffStaff: 0,
        };
    return {
      populate: {
        path: 'product',
        select: selectStr,
      },
      skip: (this._page - 1) * this._limit,
      ...(this._limit && { limit: this._limit }),
      sort: this._sortBy || `-${OrderSortBy.createdAt}`,
      projection,
    };
  }
  constructor(req: IGetTicketsReq) {
    const {
      status,
      ids,
      productName,
      expiredAtFrom,
      expiredAtTo,
      isPublished,
      page,
      limit,
      sortBy,
    } = req.query;
    this._userId =
      req.user !== undefined &&
      (req.user as IUser).accountType !== AccountType.admin
        ? (req.user as IUser)._id
        : undefined;
    this.isAdmin = (req.user as IUser).accountType === AccountType.admin;
    this._status = status as TicketStatus;
    this._ids = ids?.split(',');
    this._productName = productName;
    this._sortBy = sortBy;
    this._limit = Number(limit);
    this._page = Number(page);
    this._isPublished = isPublished != null ? JSON.parse(isPublished) : false;
    this._expiredAtTo = expiredAtTo ? moment(expiredAtTo).toDate() : undefined;
    this._expiredAtFrom = expiredAtFrom
      ? moment(expiredAtFrom).toDate()
      : undefined;
  }
}
