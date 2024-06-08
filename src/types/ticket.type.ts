import { IProduct } from '../models/product';
import { ITicket } from '../models/ticket';
import { ITimestamp, IUserReq, TPaginationQuery } from './common.type';
import { FilterQuery, Types, UpdateQuery } from 'mongoose';

export enum TicketStatus {
  verified = 'verified', // 已核銷使用
  unverified = 'unverified', // 未核銷使用
  refunded = 'refunded', // 已取消且有退款
  expired = 'expired', // 已過期
  cancelled = 'cancelled', // 已取消且無退款
  pending = 'pending', // 發生問題的票券，暫時先卡住不給用
}

export interface IGetTicketsReq extends IUserReq {
  query: TPaginationQuery<TicketSortField> & {
    ids?: string;
    productName?: string;
    status?: TicketStatus;
    expiredAtFrom?: string;
    expiredAtTo?: string;
    isPublished?: string;
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
export interface IGetTicket extends ITimestamp {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  amount: number;
  status: TicketStatus;
  isPublished: boolean;
  expiredAt: Date;
  writeOffAt: Date;
  writeOffStaffId: Types.ObjectId;
  product: Pick<
    IProduct,
    | '_id'
    | 'title'
    | 'theater'
    | 'price'
    | 'startAt'
    | 'recommendWeight'
    | 'isPublic'
    | 'photoPath'
  >;
}

export enum TicketSortField {
  createdAt = 'createdAt',
  expiredAt = 'expiredAt',
  status = 'status',
}

export interface IVerifyTicketsReq extends IUserReq {
  body: {
    tickets: {
      ticketId: string;
      userId: string;
      productId: string;
      amount: number;
    }[];
  };
}

export interface IEditTicketsReq extends IUserReq {
  body: {
    tickets: {
      ticketId: string;
      status?: TicketStatus;
      isPublished?: boolean;
      expiredAt?: Date;
    }[];
  };
}

export interface IUpdateTicket {
  ticketId: Types.ObjectId;
  filter: FilterQuery<ITicket>;
  update: UpdateQuery<ITicket>;
}

export enum UpdateAction {
  edit,
  verify,
}
