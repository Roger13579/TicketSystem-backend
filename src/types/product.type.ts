import { IProduct } from '../models/product';
import { Request } from 'express';

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

export type TPlan = {
  name: string; // 方案名稱
  discount: number; // 方案折扣數
  headCount: number; // 該方案包含幾張票
};

export type TCreateProductsReq = Request<
  unknown,
  unknown,
  { products: [IProduct] }
>;
