import { query } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import {
  MovieGenre,
  ProductSortBy,
  ProductType,
  RecommendWeightRange,
} from '../../types/product.type';

export class GetProductsPipe extends PipeBase {
  public transform() {
    return [
      query('limit')
        .exists()
        .toInt()
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'limit',
        )
        .isInt({ min: 1, max: 100 })
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'limit',
        ),
      query('page')
        .exists()
        .toInt()
        .withMessage(CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'page')
        .isInt({ min: 1 })
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'page',
        ),
      query('isLaunched')
        .optional()
        .isIn(['true', 'false'])
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': isLaunched',
        ),
      query('isPublic')
        .optional()
        .isIn(['true', 'false'])
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': isPublic',
        ),
      query('types')
        .optional()
        .isIn(Object.keys(ProductType))
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': isPublic',
        ),
      query('genres')
        .optional()
        .isIn(Object.keys(MovieGenre))
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': genre',
        ),
      query('priceMax')
        .optional()
        .toInt()
        .isInt()
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': priceMax',
        ),
      query('priceMin')
        .optional()
        .toInt()
        .isInt()
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': priceMin',
        ),
      query('recommendWeights')
        .optional()
        .custom((value: string) => {
          value.split(',').forEach((item) => {
            const isValid = Object.keys(RecommendWeightRange).includes(item);
            if (!isValid) {
              throw new Error(
                CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE +
                  'recommendWeight',
              );
            }
          });
          return true;
        }),
      query('sortBy')
        .optional()
        .custom((value: string | undefined) => {
          if (!!value) {
            const isValid = Object.keys(ProductSortBy).includes(
              value.replace('-', ''),
            );
            if (!isValid) {
              throw new Error(
                CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'sortBy',
              );
            }
          }
          return true;
        }),
      query('startAtFrom')
        .optional()
        .toDate()
        .isDate()
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
        ),
      query('startAtTo')
        .optional()
        .toDate()
        .isDate()
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
        ),
      query('sellStartAtFrom')
        .optional()
        .toDate()
        .isDate()
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
        ),
      query('sellStartAtTo')
        .optional()
        .toDate()
        .isDate()
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + 'startAtTo',
        ),
      this.validationHandler,
    ];
  }
  constructor() {
    super();
  }
}
