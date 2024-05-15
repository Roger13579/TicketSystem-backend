import { body } from 'express-validator';
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
      body('products.*.title')
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
      body('products.*.brief')
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
      body('products.*.type')
        .exists()
        .trim()
        .isIn(Object.keys(ProductType))
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'type',
        ),
      body('products.*.genre')
        .exists()
        .trim()
        .isIn(Object.keys(MovieGenre))
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'genre',
        ),
      body('products.*.vendor')
        .exists()
        .trim()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'vendor',
        ),
      body('products.*.theater')
        .exists()
        .trim()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'theater',
        ),
      body('products.*.price')
        .exists()
        .isInt({ min: 100 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'price',
        ),
      body('products.*.amount')
        .exists()
        .isInt({ min: 1 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'amount',
        ),
      body('products.*.plans.*.name')
        .if(body('products.*.plans').isArray().isLength({ min: 1 }))
        .isString()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'plan.name',
        ),
      body('products.*.plans.*.discount')
        .if(body('products.*.plans').isArray().isLength({ min: 1 }))
        .isFloat({ min: 0.1, max: 1 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'plan.discount',
        ),
      body('products.*.plans.*.headCount')
        .if(body('products.*.plans').isArray().isLength({ min: 1 }))
        .isInt({ min: 2 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'plan.headCount',
        ),
      // TODO: 這裡的驗證要修
      // body('products.*.startAt')
      //   .toDate()
      //   .isDate()
      //   .withMessage(
      //     CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'startAt',
      //   ),
      // body('products.*.endAt')
      //   .toDate()
      //   .isDate({ format: '' })
      //   .withMessage(
      //     CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'endAt',
      //   ),
      // body('products.*.sellStartAt')
      //   .toDate()
      //   .isDate()
      //   .withMessage(
      //     CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'sellStartAt',
      //   ),
      // body('products.*.sellStartEnd')
      //   .toDate()
      //   .isDate()
      //   .withMessage(
      //     CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'sellStartEnd',
      //   ),
      body('products.*.recommendWeight')
        .isInt({ min: 1, max: 5 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'recommendWeight',
        ),
      body('products.*.isPublic')
        .isBoolean()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'isPublic',
        ),
      body('products.*.isLaunched')
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
