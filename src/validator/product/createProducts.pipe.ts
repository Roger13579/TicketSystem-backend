import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import { MovieGenre, ProductType } from '../../types/product.type';

export class CreateProductsPipe extends PipeBase {
  public transform() {
    return [
      body('products')
        .exists()
        .isArray({ min: 1 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'products',
        ),
      this.nonEmptyStringValidation(
        body('products.*.title'),
        CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'title',
      )
        .isLength({ min: 1, max: 40 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'title',
        ),
      body('products.*.tags')
        .optional()
        .custom(this.validateExclusiveProps('tagNames', 'tags'))
        .withMessage(
          CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE +
            'tagIds 和 tagNames 不可以同時使用',
        ),
      body('products.*.tags.*.tagId')
        .if(body('products.*.tags').exists())
        .isString()
        .withMessage(
          CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE + 'tagId',
        ),
      body('products.*.tagNames')
        .optional()
        .custom(this.validateExclusiveProps('tagNames', 'tags'))
        .withMessage(
          CustomResponseType.INVALID_COMMENT_FILTER_MESSAGE +
            'tagIds 和 tagNames 不可以同時使用',
        ),
      this.nonEmptyStringValidation(
        body('products.*.brief'),
        CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'brief',
      )
        .isLength({ min: 1, max: 100 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'brief',
        ),
      body('products.*.type')
        .exists()
        .isIn(Object.keys(ProductType))
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'type',
        ),
      body('products.*.genre')
        .exists()
        .isIn(Object.keys(MovieGenre))
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'genre',
        ),
      this.nonEmptyStringValidation(
        body('products.*.vendor'),
        CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'vendor',
      ),
      this.nonEmptyStringValidation(
        body('products.*.theater'),
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
      body('products.*.plans')
        .optional()
        .isArray({ min: 1 })
        .withMessage(CustomResponseType.INVALID_CREATE_PRODUCT + 'plans'),
      body('products.*.plans.*.name')
        .if(body('products.*.plans').isArray({ min: 1 }))
        .exists()
        .isString()
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'plan.name',
        ),
      body('products.*.plans.*.discount')
        .if(body('products.*.plans').isArray({ min: 1 }))
        .exists()
        .isFloat({ min: 0.1, max: 1 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'plan.discount',
        ),
      body('products.*.plans.*.headCount')
        .if(body('products.*.plans').isArray({ min: 1 }))
        .exists()
        .isInt({ min: 2 })
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'plan.headCount',
        ),
      body('products.*.startAt')
        .exists()
        .custom(this.validateDate)
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'startAt',
        ),
      body('products.*.endAt')
        .custom(this.validateDate)
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'endAt',
        ),
      body('products.*.sellStartAt')
        .custom(this.validateDate)
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'sellStartAt',
        ),
      body('products.*.sellEndAt')
        .custom(this.validateDate)
        .withMessage(
          CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'sellStartEnd',
        ),
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
      this.nonEmptyStringValidation(
        body('products.*.photoPath'),
        CustomResponseType.INVALID_CREATE_PRODUCT_MESSAGE + 'photoPath',
      ),
      this.validationHandler,
    ];
  }
  constructor() {
    super();
  }
}
