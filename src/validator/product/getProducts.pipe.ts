import { query } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import {
  IGetProductsReq,
  MovieGenre,
  ProductSortField,
  ProductType,
  RecommendWeightRange,
} from '../../types/product.type';
import { OptionType, TCustomValidator } from '../index.type';
import { SortOrder } from '../../types/common.type';
import { booleanStrings } from '../../utils/constants';

// 管理者和使用者都可以使用的

export class GetProductsPipe extends PipeBase {
  private validateStartAtTo: TCustomValidator = (value, { req }) => {
    const { startAtFrom } = (req as IGetProductsReq).query;
    return this.validatePeriod(value, startAtFrom, (a, b) => a.isAfter(b));
  };

  private validateStartAtFrom: TCustomValidator = (value, { req }) => {
    const { startAtTo } = (req as IGetProductsReq).query;
    return this.validatePeriod(value, startAtTo, (a, b) => a.isBefore(b));
  };

  private validateSellStartAtFrom: TCustomValidator = (value, { req }) => {
    const { sellStartAtTo } = (req as IGetProductsReq).query;
    return this.validatePeriod(value, sellStartAtTo, (a, b) => a.isBefore(b));
  };

  private validateSellStartAtTo: TCustomValidator = (value, { req }) => {
    const { sellStartAtFrom } = (req as IGetProductsReq).query;
    return this.validatePeriod(value, sellStartAtFrom, (a, b) => a.isAfter(b));
  };

  private validatePriceRange: TCustomValidator = (value, { req }) => {
    const { priceMin, priceMax } = (req as IGetProductsReq).query;

    if (priceMax && priceMin) {
      return Number(priceMax) > Number(priceMin);
    }

    return true;
  };

  public transform = () => [
    this.limitValidation(
      query('limit'),
      CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'limit',
    ),
    this.positiveIntValidation(
      query('page'),
      CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'page',
    ),
    query('isLaunched')
      .optional()
      .isIn(booleanStrings)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'isLaunched',
      ),
    query('isPublic')
      .optional()
      .custom(this.validateMemberSpecific('true'))
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'isPublic',
      )
      .isIn(booleanStrings)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'isPublic',
      ),
    query('types')
      .optional()
      .custom(this.validateOption(OptionType.array, ProductType))
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'isPublic',
      ),
    query('genres')
      .optional()
      .custom(this.validateOption(OptionType.array, MovieGenre))
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'genres',
      ),
    query('vendors')
      .optional()
      .isString()
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'vendors',
      ),
    query('title')
      .optional()
      .isString()
      .withMessage(CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'title'),
    query('theaters')
      .optional()
      .isString()
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'theaters',
      ),
    query('startAtFrom')
      .optional()
      .custom(this.validateDate)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      )
      .custom(this.validateStartAtFrom)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      ),
    query('startAtTo')
      .optional()
      .custom(this.validateDate)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      )
      .custom(this.validateStartAtTo)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      ),
    query('sellStartAtFrom')
      .optional()
      .custom(this.validateDate)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      )
      .custom(this.validateSellStartAtFrom)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      ),
    query('sellStartAtTo')
      .optional()
      .custom(this.validateDate)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      )
      .custom(this.validateSellStartAtTo)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      ),
    query('recommendWeights')
      .optional()
      .custom(this.isAdminOnly)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'recommendWeights',
      )
      .custom(this.validateOption(OptionType.array, RecommendWeightRange))
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'recommendWeights',
      ),
    query('priceMax')
      .optional()
      .toInt()
      .isInt({ min: 0 })
      .custom(this.validatePriceRange)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'priceMax',
      ),
    query('priceMin')
      .optional()
      .toInt()
      .isInt({ min: 0 })
      .custom(this.validatePriceRange)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'priceMin',
      ),
    query('tags')
      .optional()
      .isString()
      .withMessage(CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'tags'),
    query('sortField')
      .optional()
      .custom(this.validateOption(OptionType.item, ProductSortField))
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'sortField',
      ),
    query('sortOrder')
      .optional()
      .custom(this.validateOption(OptionType.item, SortOrder))
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'sortOrder',
      ),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
