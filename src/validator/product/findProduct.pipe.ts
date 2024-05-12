import { query } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import {
  MovieGenre,
  ProductSortBy,
  ProductType,
  RecommendWeightRange,
} from '../../types/product.type';

export class FindProductPipe extends PipeBase {
  public transform() {
    return [
      query('limit')
        .exists()
        .toInt()
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': limit',
        )
        .isInt({ min: 1, max: 100 })
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': limit',
        ),
      query('page')
        .exists()
        .toInt()
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': page',
        )
        .isInt({ min: 1 })
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': page',
        ),
      query('isLaunched')
        .optional()
        .custom((value: string | undefined) => {
          if (value && value !== 'true' && value !== 'false') {
            throw new Error(
              CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE +
                ': isLaunched',
            );
          }
          return true;
        }),
      query('isPublic')
        .optional()
        .custom((value: string | undefined) => {
          if (value && value !== 'true' && value !== 'false') {
            throw new Error(
              CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': isPublic',
            );
          }
          return true;
        }),
      query('types')
        .optional()
        .custom((value: string | undefined) => {
          value?.split(',').forEach((item) => {
            const isValid = Object.keys(ProductType).includes(item);
            if (!isValid) {
              throw new Error(
                CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': type',
              );
            }
          });
          return true;
        }),
      query('genres')
        .optional()
        .custom((value: string | undefined) => {
          value?.split(',').forEach((item) => {
            const isValid = Object.keys(MovieGenre).includes(item);
            if (!isValid) {
              throw new Error(
                CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': genre',
              );
            }
          });
          return true;
        }),
      query('recommendWeights')
        .optional()
        .custom((value: string | undefined) => {
          value?.split(',').forEach((item) => {
            const isValid = Object.keys(RecommendWeightRange).includes(item);
            if (!isValid) {
              throw new Error(
                CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE +
                  ': recommendWeight',
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
                CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': sortBy',
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
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': startAtTo',
        ),
      query('startAtTo')
        .optional()
        .toDate()
        .isDate()
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': startAtTo',
        ),
      query('sellStartAtFrom')
        .optional()
        .toDate()
        .isDate()
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': startAtTo',
        ),
      query('sellStartAtTo')
        .optional()
        .toDate()
        .isDate()
        .withMessage(
          CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE + ': startAtTo',
        ),
      this.validationHandler,
    ];
  }
  constructor() {
    super();
  }
}
