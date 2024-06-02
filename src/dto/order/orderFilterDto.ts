import {
  IGetOrdersReq,
  OrderSortBy,
  PaymentStatus,
} from '../../types/order.type';
import moment from 'moment/moment';

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
  private readonly _sortBy?: OrderSortBy;

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
    return {
      ...(this._status && { status: { $eq: this._status } }),
      ...(this._ids && { _id: { $in: this._ids } }),
      ...(this._thirdPartyPaymentIds && {
        thirdPartyPaymentId: { $in: this._thirdPartyPaymentIds },
      }),
      ...(this._accounts && { account: { $in: this._accounts } }),
      ...(this._emails && { deliveryInfo: { email: { $in: this._emails } } }),
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
      ...(this._phones && { deliveryInfo: { phone: { $in: this._phones } } }),
    };
  }

  get options() {
    return {
      populate: {
        path: 'user',
        select: 'account name phone email',
      },
      skip: (this._page - 1) * this._limit,
      ...(this._limit && { limit: this._limit }),
      sort: this._sortBy || `-${OrderSortBy.createdAt}`,
    };
  }

  constructor(req: IGetOrdersReq) {
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
      sortBy,
    } = req.query;

    this._status = status as PaymentStatus;
    this._ids = ids?.split(',');

    this._thirdPartyPaymentIds = thirdPartyPaymentIds?.split(',');

    this._sortBy = sortBy as OrderSortBy;
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
