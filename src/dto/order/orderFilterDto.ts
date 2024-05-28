import { IGetOrdersReq, PaymentStatus } from '../../types/order.type';
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
  private readonly _limit: number;
  private readonly _sortBy?: string;

  get status() {
    return this._status;
  }

  get ids() {
    return this._ids;
  }

  get thirdPartyPaymentIds() {
    return this._thirdPartyPaymentIds;
  }

  get accounts() {
    return this._accounts;
  }

  get emails() {
    return this._emails;
  }

  get createdAtFrom() {
    return this._createdAtFrom;
  }

  get createdAtTo() {
    return this._createdAtTo;
  }

  get phones() {
    return this._phones;
  }

  get paidAtFrom() {
    return this._paidAtFrom;
  }

  get paidAtTo() {
    return this._paidAtTo;
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

    this._sortBy = sortBy;
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
