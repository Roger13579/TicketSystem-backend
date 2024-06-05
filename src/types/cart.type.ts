import { Types } from 'mongoose';
import { IUserReq } from './common.type';
import { IProduct } from '../models/product';
import { EditCartDTO } from '../dto/cart/editCartDto';
import { IItem } from '../models/cart';

export enum EditCartType {
  inc = 'inc',
  set = 'set',
}

export interface IEditCartReq extends IUserReq {
  body: {
    type: EditCartType;
    amount: number;
  };
}

export interface IGetCartReq extends IUserReq {
  query: {
    limit?: string;
    page?: string;
  };
}

interface ICartPaginationItem {
  product: Pick<
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
  >;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartPagination {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  totalCount: number;
  items: ICartPaginationItem[];
}

export type THandleExistedItemProp = {
  existedItem: IItem;
  editCartDto: EditCartDTO;
};
