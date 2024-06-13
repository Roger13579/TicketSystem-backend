import { IUser } from '../../models/user';
import { SortOrder } from '../../types/common.type';
import {
  IGetOrdersReq,
  OrderSortField,
  PaymentStatus,
} from '../../types/order.type';
import moment from 'moment/moment';
import { AccountType } from '../../types/user.type';

export class OrderFilterDto {
  private readonly _status?: PaymentStatus;
  private readonly _ids?: string[];
  private readonly _thirdPartyPaymentIds?: string[];
  private readonly _accounts?: string[];
  private readonly _emails?: string[];
  private readonly _createdAtFrom?: Date;
  private readonly _createdAtTo?: Date;
  private readonly _phones?: string[];
  private readonly _paidAtFrom?: Date;
  private readonly _paidAtTo?: Date;
  private readonly _page: number;
  private readonly _limit: number = 0;
  private readonly _sort: Record<string, 1 | -1>;
  private readonly _isAdmin: boolean;

  get createdAtFrom() {
    return this._createdAtFrom;
  }

  get createdAtTo() {
    return this._createdAtTo;
  }

  get paidAtFrom() {
    return this._paidAtFrom;
  }

  get paidAtTo() {
    return this._paidAtTo;
  }

  get filter() {
    const adminFilter = {
      ...(this._ids && { _id: { $in: this._ids } }),
      ...(this._thirdPartyPaymentIds && {
        thirdPartyPaymentId: { $in: this._thirdPartyPaymentIds },
      }),
      ...(this._accounts && { account: { $in: this._accounts } }),
      ...(this._phones && { deliveryInfo: { phone: { $in: this._phones } } }),
      ...(this._emails && { deliveryInfo: { email: { $in: this._emails } } }),
    };

    return {
      ...(this._isAdmin && { ...adminFilter }),
      ...(this._status && { status: { $eq: this._status } }),
      ...((this._createdAtFrom || this._createdAtTo) && {
        startAt: {
          ...(this._createdAtFrom && { $lte: this._createdAtFrom }),
          ...(this._createdAtTo && { $gte: this._createdAtTo }),
        },
      }),
      ...((this._paidAtFrom || this._paidAtTo) && {
        sellStartAt: {
          ...(this._paidAtFrom && { $lte: this._paidAtFrom }),
          ...(this._paidAtTo && { $gte: this._paidAtTo }),
        },
      }),
    };
  }

  get options() {
    return {
      populate: {
        path: 'user',
        select: 'account name phone email',
      },
      page: this._page,
      limit: this._limit,
      sort: this._sort,
    };
  }

  constructor(req: IGetOrdersReq) {
    const { query, user } = req;
    const {
      status,
      ids,
      thirdPartyPaymentIds,
      accounts,
      emails,
      createdAtFrom,
      createdAtTo,
      phones,
      paidAtFrom,
      paidAtTo,
      page,
      limit,
      sortField,
      sortOrder,
    } = query;

    this._isAdmin = !!(
      user && (user as IUser).accountType === AccountType.admin
    );

    this._status = status;
    this._ids = ids?.split(',');

    this._thirdPartyPaymentIds = thirdPartyPaymentIds?.split(',');

    this._sort = {
      [`${sortField || OrderSortField.createdAt}`]:
        sortOrder === SortOrder.asc ? 1 : -1,
    };
    this._limit = Number(limit);
    this._page = Number(page);

    this._accounts = accounts?.split(',');
    this._emails = emails?.split(',');
    this._phones = phones?.split(',');

    this._createdAtTo = createdAtTo ? moment(createdAtTo).toDate() : undefined;
    this._createdAtFrom = createdAtFrom
      ? moment(createdAtFrom).toDate()
      : undefined;
    this._paidAtFrom = paidAtFrom ? moment(paidAtFrom).toDate() : undefined;
    this._paidAtTo = paidAtTo ? moment(paidAtTo).toDate() : undefined;
  }
}
