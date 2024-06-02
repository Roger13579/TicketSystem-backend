import { IUserReq } from './common.type';

export enum TicketStatus {
  verified = 'verified', // 已核銷
  unverified = 'unverified', // 未核銷
  expired = 'expired', // 已過期
  refunded = 'refunded', // 已退款
}

export interface IGetTicketsReq extends IUserReq {
  query: {
    status?: string;
    startAtFrom?: string;
    startAtTo?: string;
    isShared?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
  };
}
