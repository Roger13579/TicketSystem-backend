import { IUserReq, SortOrder } from './common.type';
import { Types } from 'mongoose';

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
    sortField?: string;
    sortOrder?: SortOrder;
  };
}
export interface IGetTicketsRes {
  metadata: [
    {
      totalCount?: number;
    },
  ];
  tickets: IGetTicket[];
}
export interface IGetTicket {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  amount: number;
  status: TicketStatus;
  isPublished: boolean;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  writeOffAt: Date;
  writeOffStaff: string;
  product: {
    _id: Types.ObjectId;
    title: string;
    theater: string;
    price: number;
    startAt: Date;
    recommendWeight: number;
    isPublic: boolean;
    photoPath: string;
  };
}

export enum TicketSortField {
  createdAt = 'createdAt',
  expiredAt = 'expiredAt',
  status = 'status',
}
