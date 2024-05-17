import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class EditProductsPipe extends PipeBase {
  // TODO:補齊驗證
  public transform = () => [
    body('products')
      .exists()
      .isArray()
      .notEmpty()
      .custom(this.isNotEmptyArray)
      .withMessage(
        CustomResponseType.INVALID_EDIT_PRODUCT_MESSAGE + '沒有要編輯的商品',
      ),
    body('products.*.id')
      .exists()
      .withMessage(CustomResponseType.INVALID_EDIT_PRODUCT_MESSAGE + 'id')
      .isString()
      .withMessage(CustomResponseType.INVALID_EDIT_PRODUCT_MESSAGE + 'id'),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
