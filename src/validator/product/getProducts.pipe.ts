import { Meta, query } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import {
  IGetProductsReq,
  MovieGenre,
  ProductSortBy,
  ProductType,
  RecommendWeightRange,
} from '../../types/product.type';
import moment from 'moment';
import { IUser } from '../../models/user';
import { AccountType } from '../../types/user.type';

export class GetProductsPipe extends PipeBase {
  public transform = () => [
    query('limit')
      .custom((value: string | undefined, { req }: Meta) => {
        const { accountType } = req.user as IUser;
        if (accountType === AccountType.admin && !value) {
          return true;
        }
        if (!value) {
          return false;
        }
        const int = parseInt(value, 10);
        return Number.isInteger(int) && int > 0 && int < 100;
      })
      .withMessage(CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'limit'),
    query('page')
      .exists()
      .toInt()
      .withMessage(CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'page')
      .isInt({ min: 1 })
      .withMessage(CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'page'),
    query('isLaunched')
      .optional()
      .isIn(['true', 'false'])
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'isLaunched',
      ),
    query('isPublic')
      .optional()
      .isIn(['true', 'false'])
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'isPublic',
      ),
    query('types')
      .optional()
      .isIn(Object.keys(ProductType))
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'isPublic',
      ),
    query('genres')
      .optional()
      .isIn(Object.keys(MovieGenre))
      .withMessage(CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'genre'),
    query('priceMax')
      .optional()
      .toInt()
      .isInt()
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'priceMax',
      ),
    query('priceMin')
      .optional()
      .toInt()
      .isInt()
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'priceMin',
      ),
    query('recommendWeights')
      .optional()
      .custom((value: string | undefined) =>
        this.isValidOption(value, 'array', RecommendWeightRange),
      )
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'recommendWeights',
      ),
    query('sortBy')
      .optional()
      .custom((value: string | undefined) =>
        this.isValidOption(value, 'item', ProductSortBy),
      )
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'sortBy',
      ),
    query('startAtFrom')
      .optional()
      .custom(this.isValidDate)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      )
      .custom((value: string, { req }: Meta) => {
        const { startAtTo } = (req as IGetProductsReq).query;
        if (
          startAtTo &&
          this.isValidDate(value) &&
          this.isValidDate(startAtTo)
        ) {
          return moment(startAtTo).isAfter(moment(value));
        }
        return true;
      })
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      ),
    query('startAtTo')
      .optional()
      .custom(this.isValidDate)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      )
      .custom((value: string, { req }: Meta) => {
        const { startAtFrom } = (req as IGetProductsReq).query;
        if (
          startAtFrom &&
          this.isValidDate(value) &&
          this.isValidDate(startAtFrom)
        ) {
          return moment(startAtFrom).isBefore(moment(value));
        }
        return true;
      })
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      ),
    query('sellStartAtFrom')
      .optional()
      .custom(this.isValidDate)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      )
      .custom((value: string, { req }: Meta) => {
        const { sellStartAtTo } = (req as IGetProductsReq).query;
        if (
          sellStartAtTo &&
          this.isValidDate(value) &&
          this.isValidDate(sellStartAtTo)
        ) {
          return moment(sellStartAtTo).isAfter(moment(value));
        }
        return true;
      })
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      ),
    query('sellStartAtTo')
      .optional()
      .custom(this.isValidDate)
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      )
      .custom((value: string, { req }: Meta) => {
        const { sellStartAtFrom } = (req as IGetProductsReq).query;
        if (
          sellStartAtFrom &&
          this.isValidDate(value) &&
          this.isValidDate(sellStartAtFrom)
        ) {
          return moment(sellStartAtFrom).isBefore(moment(value));
        }
        return true;
      })
      .withMessage(
        CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
      ),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
