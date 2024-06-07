import { IUserReq, TPaginationQuery } from './common.type';

export interface IGetTagsReq extends IUserReq {
  query: TPaginationQuery<TagSortField> & {
    name?: string;
  };
}

export interface ICreateTagReq extends IUserReq {
  body: {
    name: string;
  };
}

export enum TagSortField {
  createdAt = 'createdAt',
  name = 'name',
}
