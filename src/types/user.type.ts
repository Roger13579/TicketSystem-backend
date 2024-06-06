import { Types } from 'mongoose';
import { IUserReq } from './common.type';
import { Request } from 'express';
import { IProduct } from '../models/product';

export enum Gender {
  male = 'male',
  female = 'female',
  none = 'none',
}

export enum AccountType {
  admin = 'admin',
  member = 'member',
}

export type TGoogleUser = {
  _json: {
    sub: string;
    name: string;
    email: string;
    picture: string;
    email_verified: boolean;
  };
};

export interface IResetPwdReq extends IUserReq {
  body: {
    oldPwd: string;
    pwd: string;
    confirmPwd: string;
  };
}

export interface ILoginReq extends Request {
  body: {
    account: string;
    pwd: string;
  };
}
export interface IRefreshTokenReq extends Request {
  body: {
    refreshToken: string;
  };
}

export interface IGetUserFavoriteReq extends IUserReq {
  query: {
    limit?: string;
    page?: string;
  };
}

interface FavoriteItem
  extends Pick<
    IProduct,
    | '_id'
    | 'title'
    | 'type'
    | 'genre'
    | 'price'
    | 'soldAmount'
    | 'amount'
    | 'isLaunched'
    | 'photoPath'
    | 'sellEndAt'
    | 'sellEndAt'
  > {}

export interface IGetFavoritePagination {
  _id: Types.ObjectId;
  totalCount: number;
  favorites: FavoriteItem[];
}
