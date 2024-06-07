import { Types } from 'mongoose';
import {
  ISubResponse,
  ITimestamp,
  IUserReq,
  TPaginationQuery,
} from './common.type';
import { IProduct } from '../models/product';
import { ICart, IItem } from '../models/cart';

export enum EditCartType {
  inc = 'inc',
  set = 'set',
}

export interface IEditCartPrevItem extends Pick<IItem, 'amount'> {
  type: EditCartType;
  productId: string;
}

export interface IEditCartReq extends IUserReq {
  body: {
    products: IEditCartPrevItem[];
  };
}

export interface IGetCartReq extends IUserReq {
  query: TPaginationQuery;
}

interface ICartPaginationItem extends ITimestamp {
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
}

export interface ICartPagination
  extends Pick<ICart, '_id' | 'userId' | 'createdAt' | 'updatedAt'> {
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

export interface IEditCartItem extends Pick<IItem, 'amount' | 'productId'> {
  type: EditCartType;
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

export type TInvalidItemParam = (
  item: unknown,
  type: EditErrorType,
) => IInvalidItem;
