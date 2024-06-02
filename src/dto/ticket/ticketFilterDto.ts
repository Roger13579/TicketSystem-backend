import { IGetOrdersReq, PaymentStatus } from '../../types/order.type';
import moment from 'moment/moment';
import { IGetTicketsReq } from '../../types/ticket.type';

export class TicketFilterDto {
  private readonly _status?: PaymentStatus;
  private readonly _startAtFrom?: Date;
  private readonly _startAtTo?: Date;
  private readonly _isShared?: boolean;
  private readonly _page: number;
  private readonly _limit: number;
  private readonly _sortBy?: string;

  get status() {
    return this._status;
  }

  get startAtFrom() {
    return this._startAtFrom;
  }

  get startAtTo() {
    return this._startAtTo;
  }

  get isShared() {
    return this._isShared;
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
  constructor(req: IGetTicketsReq) {
    const { status, startAtFrom, startAtTo, isShared, page, limit, sortBy } =
      req.query;

    this._status = status as PaymentStatus;
    this._sortBy = sortBy;
    this._limit = Number(limit);
    this._page = Number(page);
    this._isShared = isShared != null ? JSON.parse(isShared) : false;
    this._startAtTo = startAtTo ? moment(startAtTo).toDate() : undefined;
    this._startAtFrom = startAtFrom ? moment(startAtFrom).toDate() : undefined;
  }
}
