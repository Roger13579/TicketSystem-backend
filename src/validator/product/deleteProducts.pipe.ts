import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class DeleteProductsPipe extends PipeBase {
  public transform = () => [
    body('productIds')
      .exists()
      .withMessage(
        CustomResponseType.INVALID_DELETE_PRODUCT_MESSAGE + 'productIds',
      )
      .isArray()
      .custom(this.isNotEmptyArray),
    body('productIds.*')
      .exists()
      .isString()
      .withMessage(CustomResponseType.INVALID_DELETE_PRODUCT_MESSAGE + 'id'),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
