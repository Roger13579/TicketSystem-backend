import { IUserReq } from './common.type';

export enum TicketStatus {
  verified = 'verified', // 已核銷
  unverified = 'unverified', // 未核銷
  expired = 'expired', // 已過期
  refunded = 'refunded', // 已退款
}

export interface IGetTicketsReq extends IUserReq {
  query: {
    ids?: string;
    productName?: string;
    status?: string;
    expiredAtFrom?: string;
    expiredAtTo?: string;
    isPublished?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
  };
}
export enum TicketSortBy {
  createdAt = 'createdAt',
  expiredAt = 'expiredAt',
  status = 'status',
}
