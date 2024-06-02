import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class EditProductsPipe extends PipeBase {
  // TODO:補齊驗證
  public transform = () => [
    body('products')
      .exists()
      .isArray({ min: 1 })
      .withMessage(
        CustomResponseType.INVALID_EDIT_PRODUCT_MESSAGE + '沒有要編輯的商品',
      ),
    this.nonEmptyStringValidation(
      body('products.*.id'),
      CustomResponseType.INVALID_EDIT_PRODUCT_MESSAGE + 'id',
    ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
