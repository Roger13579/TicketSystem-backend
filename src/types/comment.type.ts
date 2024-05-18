import { Types } from 'mongoose';
import { IUserReq, Status } from './common.type';

export enum CommentSortBy {
  rating = 'rating',
  createdAt = 'createdAt',
  account = 'account',
  productName = 'productName',
  productId = 'productId',
}

export interface ICommentProductReq extends IUserReq {
  body: {
    productId: Types.ObjectId;
    rating: number;
    content: string;
    status: Status;
  };
}

export interface IDeleteCommentsReq extends IUserReq {
  body: {
    commentIds: string[];
  };
}

export interface IGetCommentsReq extends IUserReq {
  query: {
    limit?: string;
    page?: string;
    status?: Status;
    ratings?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    productName?: string;
    productIds?: string;
    accounts?: string;
    content?: string;
    sortBy?: CommentSortBy;
  };
}

export const RatingRange = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
};
