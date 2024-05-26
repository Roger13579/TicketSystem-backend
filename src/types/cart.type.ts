import { Types } from 'mongoose';
import { IUserReq } from './common.type';

export interface IEditCartProductReq extends IUserReq {
  body: {
    productId: Types.ObjectId;
    amount: number;
  };
}
