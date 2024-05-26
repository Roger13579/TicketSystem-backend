import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class EditCartProductPipe extends PipeBase {
  public transform = () => [
    body('productId')
      .exists()
      .withMessage(CustomResponseType.INVALID_ADD_CART_MESSAGE + 'productId')
      .isString()
      .withMessage(CustomResponseType.INVALID_ADD_CART_MESSAGE + 'productId'),
    body('amount')
      .exists()
      .withMessage(CustomResponseType.INVALID_ADD_CART_MESSAGE + 'amount')
      .isInt({ min: 0 })
      .withMessage(CustomResponseType.INVALID_ADD_CART_MESSAGE + 'amount'),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
