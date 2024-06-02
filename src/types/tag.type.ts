import { Request } from 'express';
import { SortOrder } from './common.type';

export interface IGetTagsReq extends Request {
  query: {
    limit?: string;
    page?: string;
    name?: string;
    sortOrder?: SortOrder;
    sortField?: TagSortField;
  };
}

export interface ICreateTagReq extends Request {
  body: {
    name: string;
  };
}

export enum TagSortField {
  createdAt = 'createdAt',
  name = 'name',
}
