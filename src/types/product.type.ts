import { IProduct } from '../models/product';
import { ISubResponse, IUserReq, TPaginationQuery } from './common.type';
import { Types } from 'mongoose';
import { ITagId } from './tag.type';

export enum ProductType {
  premier = '特映會',
  corporateBooking = '企業包場',
  privateBooking = '私人包場',
  preScreeningMeeting = '映前見面會',
  postScreeningMeeting = '映後見面會',
  specialEvent = '活動特別場',
  openAir = '露天電影院',
}

export enum MovieGenre {
  action = '動作片',
  adventure = '冒險片',
  comedy = '喜劇片',
  drama = '劇情片',
  horror = '恐怖片',
  fantasy = '奇幻片',
  romance = '愛情片',
  animation = '動畫片',
  thriller = '驚悚片',
  mystery = '懸疑片',
  scienceFiction = '科幻片',
  musical = '歌舞劇',
  music = '音樂片',
  war = '戰爭片',
  western = '西部片',
  epic = '史詩片',
  historical = '歷史電影',
}

export const RecommendWeightRange = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
};

export interface IProductId {
  productId: Types.ObjectId;
}

export type IPlan = {
  name: string; // 方案名稱
  discount: number; // 方案折扣數
  headCount: number; // 該方案包含幾張票
};

export interface ICreateProductsReq extends IUserReq {
  body: {
    products: (Omit<IProduct, 'tags'> & { tagNames?: string[] })[];
  };
}

export interface IGetProductsReq extends IUserReq {
  query: TPaginationQuery<ProductSortField> & {
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

export interface IDeleteProductsReq extends IUserReq {
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
  tags?: ITagId[];
  tagNames?: string[];
}

export interface IEditProduct {
  id: Types.ObjectId;
  content?: IEditContent;
}

export interface IEditProductsReq extends IUserReq {
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
  endAt: Date;
}

export interface IInvalidProduct extends ISubResponse {
  product: unknown;
}

export interface IProductWithFavorite extends IProduct {
  isFavorite: boolean;
}

export type ProductDocumentWithFavorite = Document &
  IProductWithFavorite & {
    _id: Types.ObjectId;
  };

export type TCreateInvalidProductParam = (product: unknown) => IInvalidProduct;
