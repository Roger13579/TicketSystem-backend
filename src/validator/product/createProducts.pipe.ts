import { body, check } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import { MovieGenre, ProductType } from '../../types/product.type';

// TODO:補齊驗證

export class CreateProductsPipe extends PipeBase {
  public transform() {
    return [
      body('products')
        .exists()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'products',
        ),
      check('products.*.title')
        .exists()
        .trim()
        .isString()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'title',
        )
        .isLength({ min: 1, max: 40 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'title',
        ),
      check('products.*.brief')
        .exists()
        .trim()
        .isString()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'brief',
        )
        .isLength({ min: 1, max: 100 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'brief',
        ),
      check('products.*.type')
        .exists()
        .trim()
        .isIn(Object.keys(ProductType))
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'type',
        ),
      check('products.*.genre')
        .exists()
        .trim()
        .isIn(Object.keys(MovieGenre))
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'genre',
        ),
      check('products.*.vendor')
        .exists()
        .trim()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'vendor',
        ),
      check('products.*.theater')
        .exists()
        .trim()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'theater',
        ),
      check('products.*.price')
        .exists()
        .isInt({ min: 100 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'price',
        ),
      check('products.*.amount')
        .exists()
        .isInt({ min: 1 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'amount',
        ),
      check('products.*.plans.*.name')
        .if(check('products.*.plans').isArray().isLength({ min: 1 }))
        .isString()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'plan.name',
        ),
      check('products.*.plans.*.discount')
        .if(check('products.*.plans').isArray().isLength({ min: 1 }))
        .isFloat({ min: 0.1, max: 1 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'plan.discount',
        ),
      check('products.*.plans.*.headCount')
        .if(check('products.*.plans').isArray().isLength({ min: 1 }))
        .isInt({ min: 2 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'plan.headCount',
        ),
      check('products.*.startAt')
        .isDate()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'startAt',
        ),
      check('products.*.endAt')
        .isDate()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'endAt',
        ),
      check('products.*.sellStartAt')
        .isDate()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'sellStartAt',
        ),
      check('products.*.sellStartEnd')
        .isDate()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'sellStartEnd',
        ),
      check('products.*.recommendWeight')
        .isInt({ min: 1, max: 5 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'recommendWeight',
        ),
      check('products.*.isPublic')
        .isBoolean()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'isPublic',
        ),
      check('products.*.isLaunched')
        .isBoolean()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'isLaunched',
        ),
      this.validationHandler,
    ];
  }
  constructor() {
    super();
  }
}
