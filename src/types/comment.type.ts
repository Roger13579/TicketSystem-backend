import { Types } from 'mongoose';
import {
  ISubResponse,
  IUserReq,
  Status,
  TPaginationQuery,
} from './common.type';
import { CustomResponseType } from './customResponseType';
import { IUser } from '../models/user';
import { IComment } from '../models/comment';

export enum CommentSortField {
  rating = 'rating',
  createdAt = 'createdAt',
  account = 'account',
  productName = 'productName',
  productId = 'productId',
}

export interface ICommentProductReq extends IUserReq {
  body: Pick<IComment, 'rating' | 'content'> & { productId: Types.ObjectId };
}

export interface IDeleteCommentsReq extends IUserReq {
  body: {
    commentIds: Types.ObjectId[];
  };
}

export interface IGetCommentsReq extends IUserReq {
  query: TPaginationQuery<CommentSortField> & {
    status?: Status;
    ratings?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    productName?: string;
    productIds?: string;
    accounts?: string;
    content?: string;
  };
}

export const RatingRange = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
};

export interface IGetComment
  extends Pick<
    IComment,
    'rating' | 'content' | 'createdAt' | 'status' | '_id' | 'productId'
  > {
  user: Pick<IUser, '_id' | 'account' | 'avatarPath' | 'name'>;
}

export interface IGetCommentsPagination {
  metadata: { totalCount: number };
  comments: IGetComment[];
}

export interface IEditComment {
  id: Types.ObjectId;
  status: Status;
}

export interface IEditCommentsReq {
  body: {
    comments: {
      id: string;
      status: Status;
    }[];
  };
}

export interface IInvalidComment extends ISubResponse {
  comment: unknown;
}

export type TCreateInvalidCommentParam = (
  comment: unknown,
  status: CustomResponseType,
) => IInvalidComment;
