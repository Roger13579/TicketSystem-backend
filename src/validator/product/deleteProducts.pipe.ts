import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class DeleteProductsPipe extends PipeBase {
  public transform = () => [
    body('productIds')
      .exists()
      .isArray({ min: 1 })
      .withMessage(
        CustomResponseType.INVALID_DELETE_PRODUCT_MESSAGE + 'productIds',
      ),
    this.nonEmptyStringValidation(
      body('productIds.*'),
      CustomResponseType.INVALID_DELETE_PRODUCT_MESSAGE + 'id',
    ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
