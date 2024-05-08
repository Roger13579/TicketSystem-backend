import { IUser } from '../models/user';
import {
  MovieGenre,
  ProductSortBy,
  ProductType,
  RecommendWeightRange,
  TGetProductsReq,
} from '../types/product.type';
import { AccountType } from '../types/user.type';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import {
  checkDateOrder,
  parseBoolean,
  parseDate,
  parsePositiveInteger,
  parseValidEnums,
} from '../utils/common';

export class ProductFilterDTO {
  public readonly title?: string;
  public readonly types?: ProductType[];
  public readonly genres?: MovieGenre[];
  public readonly vendors?: string[];
  public readonly theaters?: string[];
  public readonly isPublic?: boolean;
  public readonly isLaunched?: boolean;
  public readonly startAtFrom?: Date;
  public readonly startAtTo?: Date;
  public readonly recommendWeights?: number[];
  public readonly sellStartAtFrom?: Date;
  public readonly sellStartAtTo?: Date;
  public readonly priceMax?: number;
  public readonly priceMin?: number;
  public readonly tags?: string[];
  public readonly page?: number;
  public readonly limit?: number;
  public readonly sortBy?: string;
  public readonly accountType: AccountType = AccountType.member;

  get getFilter() {
    return this;
  }

  constructor(req: TGetProductsReq) {
    const {
      title,
      types,
      genres,
      vendors,
      theaters,
      isLaunched,
      isPublic,
      startAtFrom,
      startAtTo,
      sellStartAtFrom,
      recommendWeights,
      sellStartAtTo,
      priceMax,
      priceMin,
      tags,
      page,
      limit,
      sortBy,
    } = req.query;

    if ((req.user as IUser)?.accountType === AccountType.admin) {
      this.accountType = AccountType.admin;
    }

    // number
    this.limit = parsePositiveInteger('limit', limit);
    this.priceMax = parsePositiveInteger('priceMax', priceMax);
    this.priceMin = parsePositiveInteger('priceMin', priceMin);
    this.page = parsePositiveInteger('page', page);

    // string
    this.title = title;

    // validate
    this.types = parseValidEnums('type', ProductType, types);
    this.genres = parseValidEnums('genre', MovieGenre, genres);

    const validRecommendWeights: number[] = [];
    recommendWeights?.split(',').forEach((weight) => {
      const weightNum = parsePositiveInteger('recommendWeight', weight);
      if (
        weightNum &&
        Object.values(RecommendWeightRange).indexOf(weightNum) > -1
      ) {
        validRecommendWeights.push(weightNum);
      }
    });

    if (validRecommendWeights.length > 0) {
      this.recommendWeights = validRecommendWeights;
    }

    if (sortBy) {
      const isValidSortBy =
        Object.keys(ProductSortBy).indexOf(sortBy.trim().replace('-', '')) >= 0;
      if (isValidSortBy) {
        this.sortBy = sortBy as ProductSortBy;
      } else {
        throwError(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE +
            `: sortBy 不得為 ${sortBy}`,
          CustomResponseType.INVALID_PRODUCT_FILTER,
        );
      }
    }

    // array
    this.vendors = vendors?.split(',');
    this.theaters = theaters?.split(',');
    this.tags = tags?.split(',');

    // boolean
    this.isLaunched = parseBoolean('isLaunched', isLaunched);
    this.isPublic = parseBoolean('isPublic', isPublic);

    // time
    this.startAtTo = parseDate('startAtTo', startAtTo);
    this.startAtFrom = parseDate('startAtFrom', startAtFrom);
    this.sellStartAtFrom = parseDate('sellStartAtFrom', sellStartAtFrom);
    this.sellStartAtTo = parseDate('sellStartAtTo', sellStartAtTo);
    // 確認時間順序
    checkDateOrder(
      { prop: 'sellStartAtFrom', value: this.sellStartAtFrom },
      { prop: 'sellStartAtTo', value: this.sellStartAtTo },
      { prop: 'startAtFrom', value: this.startAtFrom },
      { prop: 'startAtTo', value: this.startAtTo },
    );
  }
}
