import {
  ISubResponse,
  ITimestamp,
  IUserReq,
  TPaginationQuery,
} from './common.type';
import { IProduct } from '../models/product';
import { ICart, IItem } from '../models/cart';
import { IUserId } from './user.type';
import { Types } from 'mongoose';
import { IPlan } from './product.type';

export enum EditCartType {
  inc = 'inc',
  set = 'set',
}

export enum DeleteCartType {
  all = 'all',
  items = 'items',
}

export interface ICartProduct extends Pick<IItem, 'productId' | 'plan'> {}

export interface IEditCartPrevItem extends ICartProduct, Pick<IItem, 'amount'> {
  type: EditCartType;
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
    | 'sellStartAt'
    | 'sellEndAt'
  >;
  amount: number;
}

export interface ICartPagination
  extends Pick<ICart, '_id' | 'userId' | 'createdAt' | 'updatedAt'> {
  totalCount: number;
  items: ICartPaginationItem[];
}

export interface IEditItemParams extends IUserId {
  item: IEditCartItem;
}

export interface IHandleExistedItemParams extends IEditItemParams {
  existedItem: IItem;
}

export interface IDeleteItemParams extends IUserId {
  item: ICartProduct;
}

export interface IDeleteCartReq extends IUserReq {
  body: {
    type: DeleteCartType;
    products: ICartProduct[];
  };
}

export interface IDeleteCartItem extends ICartProduct {
  productId: Types.ObjectId;
  plan: IPlan;
}

export interface IEditCartItem extends Pick<IItem, 'amount'>, ICartProduct {
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
