import { IGetTicketsReq, SharedTicketSortField } from '../../types/ticket.type';
import { SortOrder } from '../../types/common.type';

export class GetSharedTicketsDto {
  private readonly _page: number;
  private readonly _limit: number;
  private readonly _sort: Record<string, 1 | -1>;
  get page() {
    return this._page;
  }

  get limit() {
    return this._limit;
  }

  get sort() {
    return this._sort;
  }

  get options() {
    const productSelect = {
      title: 1,
      photoPath: 1,
      price: 1,
      theater: 1,
      startAt: 1,
    };
    const ticketSelect = {
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
    };
    return {
      productSelect,
      ticketSelect,
      page: this._page,
      limit: this._limit,
      sort: this._sort,
    };
  }
  constructor(req: IGetTicketsReq) {
    const { page, limit, sortField, sortOrder } = req.query;
    this._sort = {
      [`${sortField || SharedTicketSortField.updatedAt}`]:
        sortOrder === SortOrder.desc ? 1 : -1,
    };
    this._limit = Number(limit);
    this._page = Number(page);
  }
}
