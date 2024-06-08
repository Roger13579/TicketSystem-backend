import { IProduct } from '../models/product';
import { ITimestamp, IUserReq, TPaginationQuery } from './common.type';
import { Types } from 'mongoose';

export enum TicketStatus {
  verified = 'verified', // 已核銷
  unverified = 'unverified', // 未核銷
  refunded = 'refunded', // 已退款
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

export interface IVerifyTicket {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  ticketId: Types.ObjectId;
  amount: number;
}
