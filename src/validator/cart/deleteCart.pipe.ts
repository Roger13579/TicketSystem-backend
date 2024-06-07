import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import { DeleteCartType, IDeleteCartReq } from '../../types/cart.type';
import { TCustomValidator } from '../index.type';

export class DeleteCartPipe extends PipeBase {
  private validateProductIds: TCustomValidator<unknown> = (value, { req }) => {
    const { type } = (req as IDeleteCartReq).body;

    const isClearAll = type === DeleteCartType.all && !value;
    const isProductsStrArr =
      Array.isArray(value) && value.every((item) => typeof item === 'string');
    const isClearItems = type === DeleteCartType.items && isProductsStrArr;

    return isClearAll || isClearItems;
  };

  public transform = () => [
    body('type')
      .exists()
      .isIn(Object.keys(DeleteCartType))
      .withMessage(CustomResponseType.INVALID_DELETE_CART_MESSAGE + 'type'),
    body('productIds')
      .custom(this.validateProductIds)
      .withMessage(
        CustomResponseType.INVALID_DELETE_CART_MESSAGE + 'productIds',
      ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
