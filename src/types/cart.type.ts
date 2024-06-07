import { Types } from 'mongoose';
import { ISubResponse, IUserReq } from './common.type';
import { IProduct } from '../models/product';
import { IItem } from '../models/cart';

export enum EditCartType {
  inc = 'inc',
  set = 'set',
}

export interface IEditCartPrevItem {
  type: EditCartType;
  amount: number;
  productId: string;
}

export interface IEditCartReq extends IUserReq {
  body: {
    products: IEditCartPrevItem[];
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
  userId: Types.ObjectId;
  item: IEditCartItem;
};

export enum DeleteCartType {
  all = 'all',
  items = 'items',
}

export interface IDeleteCartReq extends IUserReq {
  body: {
    type: DeleteCartType;
    productIds?: string[];
  };
}

export interface IEditCartItem {
  type: EditCartType;
  amount: number;
  productId: Types.ObjectId;
}

export enum EditErrorType {
  INVALID_PRODUCT,
  INVALID_ADD,
  INVALID_DELETE,
  INVALID_INC_DES,
  UNKNOWN,
}

export interface IInvalidItem extends ISubResponse {
  item: unknown;
}

export type TCreateInvalidItemParam = (
  item: unknown,
  type: EditErrorType,
) => IInvalidItem;
