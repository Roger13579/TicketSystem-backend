import { IUserReq } from './common.type';
import { Request } from 'express';

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
