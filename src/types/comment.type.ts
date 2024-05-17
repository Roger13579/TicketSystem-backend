import { Types } from 'mongoose';
import { IUserReq, Status } from './common.type';

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
