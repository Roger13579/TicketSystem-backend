import moment from 'moment';
import { IUser } from '../../models/user';
import {
  ProductType,
  MovieGenre,
  IGetProductsReq,
} from '../../types/product.type';
import { AccountType } from '../../types/user.type';

export class ProductFilterDTO {
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
  private readonly _accountType: AccountType = AccountType.member;

  get title() {
    return this._title;
  }

  get types() {
    return this._types;
  }

  get genres() {
    return this._genres;
  }

  get vendors() {
    return this._vendors;
  }

  get theaters() {
    return this._theaters;
  }

  get isLaunched() {
    return this._isLaunched;
  }

  get isPublic() {
    return this._isPublic;
  }
  get startAtFrom() {
    return this._startAtFrom;
  }
  get startAtTo() {
    return this._startAtTo;
  }
  get sellStartAtFrom() {
    return this._sellStartAtFrom;
  }
  get recommendWeights() {
    return this._recommendWeights;
  }
  get sellStartAtTo() {
    return this._sellStartAtTo;
  }
  get priceMax() {
    return this._priceMax;
  }

  get page() {
    return this._page;
  }

  get limit() {
    return this._limit;
  }

  get priceMin() {
    return this._priceMin;
  }

  get tags() {
    return this._tags;
  }

  get sortBy() {
    return this._sortBy;
  }

  get accountType() {
    return this._accountType;
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
      this._accountType = AccountType.admin;
    }

    this._types = types?.split(',') as ProductType[];
    this._genres = genres?.split(',') as MovieGenre[];

    this._recommendWeights = recommendWeights
      ?.split(',')
      .map((weight) => Number(weight));

    this._sortBy = sortBy;
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
