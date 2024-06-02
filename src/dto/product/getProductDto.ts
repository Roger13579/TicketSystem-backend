import moment from 'moment';
import { IUser } from '../../models/user';
import {
  ProductType,
  MovieGenre,
  IGetProductsReq,
  ProductSortBy,
} from '../../types/product.type';
import { AccountType } from '../../types/user.type';
import { omitBy, isNil } from 'lodash';
import { defaultProjection } from '../../utils/product.constants';

export class GetProductDTO {
  private readonly _title?: string;
  private readonly _types?: ProductType[];
  private readonly _genres?: MovieGenre[];
  private readonly _vendors?: string[];
  private readonly _theaters?: string[];
  private readonly _isPublic?: boolean;
  private readonly _isLaunched?: boolean;
  private readonly _startAtFrom?: Date;
  private readonly _startAtTo?: Date;
  private readonly _recommendWeights?: number[];
  private readonly _sellStartAtFrom?: Date;
  private readonly _sellStartAtTo?: Date;
  private readonly _priceMax?: number;
  private readonly _priceMin?: number;
  private readonly _tags?: string[];
  private readonly _page: number;
  private readonly _limit: number;
  private readonly _sortBy?: string;
  private readonly _isAdmin: boolean = false;

  get startAtFrom() {
    return this._startAtFrom;
  }
  get startAtTo() {
    return this._startAtTo;
  }
  get sellStartAtFrom() {
    return this._sellStartAtFrom;
  }

  get sellStartAtTo() {
    return this._sellStartAtTo;
  }

  get filter() {
    const titleRegex = this._title ? new RegExp(this._title) : undefined;

    const target = {
      ...(titleRegex && { title: { $regex: titleRegex } }),
      ...(this._types && { type: { $in: this._types } }),
      ...(this._genres && { genre: { $in: this._genres } }),
      ...(this._vendors && { vendor: { $in: this._vendors } }),
      ...(this._theaters && { theater: { $in: this._theaters } }),
      ...(this._recommendWeights && {
        recommendWeight: { $in: this._recommendWeights },
      }),
      ...(this._isLaunched !== undefined && { isLaunched: this._isLaunched }),
      ...(this._isPublic !== undefined && { isPublic: this._isPublic }),
      ...((this.startAtFrom || this.startAtTo) && {
        startAt: omitBy(
          {
            ...(this.startAtFrom && { $lte: this.startAtFrom }),
            ...(this.startAtTo && { $gte: this.startAtTo }),
          },
          isNil,
        ),
      }),
      ...((this.sellStartAtFrom || this.sellStartAtTo) && {
        sellStartAt: omitBy(
          {
            ...(this.sellStartAtFrom && { $lte: this.sellStartAtFrom }),
            ...(this.sellStartAtTo && { $gte: this.sellStartAtTo }),
          },
          isNil,
        ),
      }),
      ...((this._priceMax || this._priceMin) && {
        price: omitBy(
          {
            ...(this._priceMin && { $lte: this._priceMin }),
            ...(this._priceMax && { $gte: this._priceMax }),
          },
          isNil,
        ),
      }),
      ...(this._tags && { tags: { $in: this._tags } }),
    };

    return omitBy(target, isNil);
  }

  get options() {
    const projection = this._isAdmin
      ? {
          ...defaultProjection,
          isPublic: 1,
          sellStartAt: 1,
          sellEndAt: 1,
          startAt: 1,
          endAt: 1,
          vendor: 1,
          tags: 1,
          price: 1,
          soldAmount: 1,
          amount: 1,
        }
      : { ...defaultProjection, recommendWeight: 0, isPublic: 0 };
    return {
      skip: (this._page - 1) * this._limit,
      ...(this._limit && { limit: this._limit }),
      sort: this._sortBy || `-${ProductSortBy.createdAt}`,
      projection,
    };
  }

  constructor(req: IGetProductsReq) {
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
      this._isAdmin = true;
    }

    this._types = types?.split(',') as ProductType[];
    this._genres = genres?.split(',') as MovieGenre[];

    this._recommendWeights = recommendWeights
      ?.split(',')
      .map((weight) => Number(weight));

    this._sortBy = sortBy as ProductSortBy;
    this._title = title;
    this._limit = Number(limit);
    this._priceMax = isNaN(Number(priceMax)) ? undefined : Number(priceMax);
    this._priceMin = isNaN(Number(priceMin)) ? undefined : Number(priceMin);
    this._page = Number(page);

    this._vendors = vendors?.split(',');
    this._theaters = theaters?.split(',');
    this._tags = tags?.split(',');

    this._isLaunched =
      isLaunched === undefined ? undefined : isLaunched === 'true';
    this._isPublic = isPublic === undefined ? undefined : isPublic === 'true';

    this._startAtTo = startAtTo ? moment(startAtTo).toDate() : undefined;
    this._startAtFrom = startAtFrom ? moment(startAtFrom).toDate() : undefined;
    this._sellStartAtFrom = sellStartAtFrom
      ? moment(sellStartAtFrom).toDate()
      : undefined;
    this._sellStartAtTo = sellStartAtTo
      ? moment(sellStartAtTo).toDate()
      : undefined;
  }
}
