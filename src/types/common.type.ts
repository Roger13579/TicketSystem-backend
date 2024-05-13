import { IUser } from '../models/user';
import { Request } from 'express';

export interface IUserReq extends Request {
  user?: IUser | Express.User;
}

export enum Status {
  active = 'active',
  disabled = 'disabled',
}

// TODO: 未定的假設 Type for Error
export interface ICustomMongooseError extends Error {
  errors: string[];
}

export interface TCustomMongoDBError extends Error {
  writeErrors: { err: { errmsg: string } }[];
}

export interface IThrowError extends Error {
  status?: string;
}
