import { Types } from 'mongoose';
import { IUserReq, TPaginationQuery } from './common.type';
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

export enum ThirdPartyType {
  google = 'google',
}

export interface IUserId {
  userId: Types.ObjectId;
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

export interface ILoginReq extends IUserReq {
  body: {
    account: string;
    pwd: string;
  };
}
export interface IRefreshTokenReq extends IUserReq {
  body: {
    refreshToken: string;
  };
}

export interface IGetUserFavoriteReq extends IUserReq {
  query: TPaginationQuery;
}

export interface FavoriteItem
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
    | 'sellStartAt'
    | 'sellEndAt'
  > {
  isFavorite: boolean;
}

export interface IGetFavoritePagination {
  _id: Types.ObjectId;
  totalCount: number;
  favorites: FavoriteItem[];
}

export interface ISignUpReq extends IUserReq {
  body: {
    email: string;
    account: string;
    pwd: string;
    confirmPwd: string;
  };
}

export interface IGoogleSignUpReq extends IUserReq {
  body: {
    account: string;
    pwd: string;
    confirmPwd: string;
  };
}

export interface IForgetPwdReq extends IUserReq {
  body: {
    email: string;
  };
}

export interface IUpdateUserDetailReq extends IUserReq {
  body: {
    name: string;
    birthDate: Date;
    gender: Gender;
    phone: string;
    address: string;
  };
}
