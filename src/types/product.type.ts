import { IProduct } from '../models/product';
import { Request } from 'express';
import { UserReq } from './common.type';

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

export type TPlan = {
  name: string; // 方案名稱
  discount: number; // 方案折扣數
  headCount: number; // 該方案包含幾張票
};

export interface TCreateProductsReq extends Request {
  body: {
    products: IProduct[];
  };
}

export interface TGetProductsReq extends UserReq {
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
    sortBy?: string;
  };
}

export enum ProductSortBy {
  startAt = 'startAt',
  price = 'price',
  sellStartAt = 'sellStartAt',
  type = 'type',
  vendor = 'vendor',
  theater = 'theater',
  title = 'title',
  _id = '_id',
  soldAmount = 'soldAmount',
  createdAt = 'createdAt',
}
