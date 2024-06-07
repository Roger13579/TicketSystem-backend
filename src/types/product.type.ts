import { IProduct } from '../models/product';
import { Request } from 'express';
import { ISubResponse, IUserReq, SortOrder } from './common.type';
import { Types } from 'mongoose';
import { IProductId } from '../models/baseModel';

export enum ProductType {
  premier = 'premier',
  corporateBooking = 'corporateBooking',
  privateBooking = 'privateBooking',
  preScreeningMeeting = 'preScreeningMeeting',
  postScreeningMeeting = 'postScreeningMeeting',
  specialEvent = 'specialEvent',
  openAir = 'openAir',
}

export enum MovieGenre {
  action = 'action',
  adventure = 'adventure',
  comedy = 'comedy',
  drama = 'drama',
  horror = 'horror',
  fantasy = 'fantasy',
  romance = 'romance',
  animation = 'animation',
  thriller = 'thriller',
  mystery = 'mystery',
  scienceFiction = 'scienceFiction',
  musical = 'musical',
  music = 'music',
  war = 'war',
  western = 'western',
  epic = 'epic',
  historical = 'historical',
}

export const RecommendWeightRange = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
};

export type IPlan = {
  name: string; // 方案名稱
  discount: number; // 方案折扣數
  headCount: number; // 該方案包含幾張票
};

export interface ICreateProductsReq extends Request {
  body: {
    products: (Omit<IProduct, 'tags'> & { tagNames?: string[] })[];
  };
}

export interface IGetProductsReq extends IUserReq {
  query: {
    title?: string;
    types?: string;
    genres?: string;
    vendors?: string;
    theaters?: string;
    isPublic?: string;
    isLaunched?: string;
    startAtFrom?: string;
    startAtTo?: string;
    sellStartAtFrom?: string;
    sellStartAtTo?: string;
    recommendWeights?: string;
    priceMax?: string;
    priceMin?: string;
    tags?: string;
    page?: string;
    limit?: string;
    sortField?: ProductSortField;
    sortOrder?: SortOrder;
  };
}

export enum ProductSortField {
  startAt = 'startAt',
  price = 'price',
  sellStartAt = 'sellStartAt',
  type = 'type',
  vendor = 'vendor',
  theater = 'theater',
  title = 'title',
  id = 'id',
  soldAmount = 'soldAmount',
  createdAt = 'createdAt',
  recommendWeight = 'recommendWeight',
}

export interface IDeleteProductsReq extends Request {
  body: {
    productIds: Types.ObjectId[];
  };
}

export interface IEditContent {
  title?: string;
  type?: ProductType;
  genre?: MovieGenre;
  vendor?: string;
  theater?: string;
  price?: number;
  amount?: number; // 票券總量
  plans?: IPlan[];
  startAt?: Date;
  endAt?: Date;
  sellStartAt?: Date;
  sellEndAt?: Date;
  recommendWeight?: number;
  isPublic?: boolean;
  isLaunched?: boolean;
  photoPath?: string;
  notifications?: [string];
  highlights?: [string];
  introduction?: string;
  cautions?: [string];
  confirmations?: [string];
  cancelPolicies?: [string];
  certificates?: [string];
  brief?: string;
  tags?: { tagId: Types.ObjectId }[];
}

export interface IEditProductsReq extends Request {
  body: {
    products: (IEditContent & { id: Types.ObjectId })[];
  };
}

/**
 * @description 商品在訂單中需要被 snapshot 的部分
 */
export interface IProductSnapshot extends IProductId {
  title: string;
  brief: string;
  type: ProductType;
  genre: MovieGenre;
  vendor: string;
  theater: string;
  price: number;
  startAt: Date;
}

export interface IInvalidProduct extends ISubResponse {
  product: unknown;
}

export type TCreateInvalidProductParam = (product: unknown) => IInvalidProduct;
