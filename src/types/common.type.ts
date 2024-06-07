import { IUser } from '../models/user';
import { Request } from 'express';
import { CustomResponseType } from './customResponseType';

export interface IUserReq extends Request {
  user?: IUser | Express.User;
}

export enum Status {
  active = 'active',
  disabled = 'disabled',
}

export enum SortOrder {
  desc = 'desc',
  asc = 'asc',
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

export interface ISubResponse {
  subStatus: CustomResponseType;
  subMessage: string;
}
