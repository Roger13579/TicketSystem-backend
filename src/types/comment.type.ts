import { Types } from 'mongoose';
import { IUserReq, SortOrder, Status } from './common.type';

export enum CommentSortField {
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
  };
}

export interface IDeleteCommentsReq extends IUserReq {
  body: {
    commentIds: Types.ObjectId[];
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
    sortField?: CommentSortField;
    sortOrder?: SortOrder;
  };
}

export const RatingRange = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
};

export interface IGetComment {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  rating: number;
  content: string;
  status: Status;
  createdAt: Date;
  user: {
    _id: Types.ObjectId;
    account: string;
    avatarPath: string;
    name: string;
  };
}

export interface IGetCommentsRes {
  metadata: [
    {
      totalCount?: number;
    },
  ];
  comments: IGetComment[];
}

export interface IEditCommentsReq {
  body: {
    comments: {
      id: string;
      status: Status;
    }[];
  };
}
