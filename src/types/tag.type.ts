import { Request } from 'express';

export interface IGetTagsReq extends Request {
  query: {
    limit?: string;
    page?: string;
    name?: string;
  };
}

export interface ICreateTagReq extends Request {
  body: {
    name: string;
  };
}

export enum TagSortBy {
  createdAt = 'createdAt',
  name = 'name',
}
