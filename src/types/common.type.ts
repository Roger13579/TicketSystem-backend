import { IUser } from '../models/user';
import { NextFunction, Request, Response } from 'express';
import { CustomResponseType } from './customResponseType';
import { ResponseObject } from '../utils/responseObject';

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

export interface IThrowError extends Error {
  status?: string;
}

export interface ISubResponse {
  subStatus: CustomResponseType;
  subMessage: string;
}

export type TMethod<
  ReqType = IUserReq,
  ReturnType = Promise<ResponseObject>,
> = (req: ReqType, res: Response, next: NextFunction) => ReturnType;

export type TPaginationQuery<T = undefined> = {
  limit?: string;
  page?: string;
  sortOrder?: SortOrder;
  sortField?: T;
};

export interface ITimestamp {
  createdAt: Date;
  updatedAt: Date;
}
