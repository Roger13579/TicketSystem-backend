import moment from 'moment/moment';
import {
  IGetTicketsReq,
  TicketSortField,
  TicketStatus,
} from '../../types/ticket.type';
import { Types } from 'mongoose';
import { IUser } from '../../models/user';
import { AccountType } from '../../types/user.type';
import { SortOrder } from '../../types/common.type';

export class GetTicketsDto {
  private readonly _status?: TicketStatus;
  private readonly _userId?: Types.ObjectId | undefined;
  private readonly _expiredAtFrom?: Date;
  private readonly _expiredAtTo?: Date;
  private readonly _isPublished?: boolean;
  private readonly _page: number;
  private readonly _limit: number;
  private readonly _sort: Record<string, 1 | -1>;
  private readonly _ids?: string[];
  private readonly _productName?: string;
  private readonly _isAdmin?: boolean;

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

  get sort() {
    return this._sort;
  }

  get ids() {
    return this._ids;
  }
  get productName() {
    return this._productName;
  }
  /**
   * @description lookup to products
   */
  get productNameRegex() {
    return this._productName && this._isAdmin
      ? new RegExp(this._productName)
      : undefined;
  }
  get userId() {
    return this._userId;
  }
  get filter() {
    return {
      ...(this._status && { status: { $eq: this._status } }),
      ...(this._userId && { userId: { $eq: this._userId } }),
      ...(this._ids && { _id: { $in: this._ids } }),
      ...((this._expiredAtFrom || this._expiredAtTo) && {
        expiredAt: {
          ...(this._expiredAtFrom && { $gte: this._expiredAtFrom }),
          ...(this._expiredAtTo && { $lte: this._expiredAtTo }),
        },
      }),
      ...(this._isPublished && { isPublished: { $eq: this._isPublished } }),
    };
  }
  get options() {
    const productSelect = this._isAdmin
      ? {
          title: 1,
          photoPath: 1,
          price: 1,
          theater: 1,
          startAt: 1,
          isPublic: 1,
          recommendWeight: 1,
        }
      : {
          title: 1,
          photoPath: 1,
          price: 1,
          theater: 1,
          startAt: 1,
        };
    const ticketSelect = this._isAdmin
      ? {
          _id: 1,
          productId: 1,
          userId: 1,
          orderId: 1,
          status: 1,
          isPublished: 1,
          expiredAt: 1,
          createdAt: 1,
          updatedAt: 1,
          writeOffAt: 1,
          writeOffStaffId: 1,
          product: 1,
          refundReason: 1,
        }
      : {
          _id: 1,
          productId: 1,
          userId: 1,
          orderId: 1,
          status: 1,
          isPublished: 1,
          expiredAt: 1,
          createdAt: 1,
          updatedAt: 1,
          product: 1,
          refundReason: 1,
        };
    return {
      productSelect,
      page: this._page,
      limit: this._limit,
      sort: this._sort,
      ticketSelect,
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
      sortField,
      sortOrder,
    } = req.query;
    this._userId =
      req.user !== undefined &&
      (req.user as IUser).accountType !== AccountType.admin
        ? (req.user as IUser)._id
        : undefined;
    this._isAdmin =
      req.user !== undefined
        ? (req.user as IUser).accountType === AccountType.admin
        : false;
    this._status = status;
    this._ids = ids?.split(',');
    this._productName = productName;
    this._sort = {
      [`${sortField || TicketSortField.createdAt}`]:
        sortOrder === SortOrder.asc ? 1 : -1,
    };
    this._limit = Number(limit);
    this._page = Number(page);
    this._isPublished = isPublished != null ? JSON.parse(isPublished) : false;
    this._expiredAtTo = expiredAtTo ? moment(expiredAtTo).toDate() : undefined;
    this._expiredAtFrom = expiredAtFrom
      ? moment(expiredAtFrom).toDate()
      : undefined;
  }
}
