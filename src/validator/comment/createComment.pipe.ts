import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class CreateCommentPipe extends PipeBase {
  public transform = () => [
    this.nonEmptyStringValidation(
      body('productId'),
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
    this.nonEmptyStringValidation(
      body('content'),
      CustomResponseType.INVALID_COMMENT_PRODUCT_MESSAGE + 'content',
    ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
