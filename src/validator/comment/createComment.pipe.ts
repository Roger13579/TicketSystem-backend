import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import { Status } from '../../types/common.type';

export class CreateCommentPipe extends PipeBase {
  public transform = () => [
    body('productId')
      .exists()
      .withMessage(
        CustomResponseType.INVALID_COMMENT_PRODUCT_MESSAGE + 'productId',
      )
      .isString()
      .withMessage(
        CustomResponseType.INVALID_COMMENT_PRODUCT_MESSAGE + 'productId',
      ),
    body('rating')
      .exists()
      .withMessage(
        CustomResponseType.INVALID_COMMENT_PRODUCT_MESSAGE + 'rating',
      )
      .isInt({ min: 1, max: 5 })
      .withMessage(
        CustomResponseType.INVALID_COMMENT_PRODUCT_MESSAGE + 'rating',
      ),
    body('content')
      .exists()
      .withMessage(
        CustomResponseType.INVALID_COMMENT_PRODUCT_MESSAGE + 'content',
      )
      .trim()
      .isString()
      .withMessage(
        CustomResponseType.INVALID_COMMENT_PRODUCT_MESSAGE + 'content',
      )
      .notEmpty()
      .withMessage(
        CustomResponseType.INVALID_COMMENT_PRODUCT_MESSAGE + 'content',
      ),
    body('status')
      .exists()
      .withMessage(
        CustomResponseType.INVALID_COMMENT_PRODUCT_MESSAGE + 'status',
      )
      .isIn(Object.keys(Status))
      .withMessage(
        CustomResponseType.INVALID_COMMENT_PRODUCT_MESSAGE + 'status',
      ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
