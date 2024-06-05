import { Meta, body, param } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import { EditCartType, IEditCartReq } from '../../types/cart.type';

export class EditCartPipe extends PipeBase {
  private validateAmount = (value: number, { req }: Meta) => {
    const { type } = (req as IEditCartReq).body;
    const isSetNegativeAmount = type === EditCartType.set && value < 1;
    const isNonIncAmount = type === EditCartType.inc && value === 0;
    const isInvalid = isSetNegativeAmount || isNonIncAmount;
    return !isInvalid;
  };

  public transform = () => [
    this.nonEmptyStringValidation(
      param('productId'),
      CustomResponseType.INVALID_ADD_CART_MESSAGE + 'productId',
    ),
    body('type')
      .exists()
      .withMessage(CustomResponseType.INVALID_ADD_CART_MESSAGE + 'type')
      .isIn(Object.keys(EditCartType))
      .withMessage(CustomResponseType.INVALID_ADD_CART_MESSAGE + 'type'),
    body('amount')
      .exists()
      .withMessage(CustomResponseType.INVALID_ADD_CART_MESSAGE + 'amount')
      .isInt()
      .custom(this.validateAmount)
      .withMessage(CustomResponseType.INVALID_ADD_CART_MESSAGE + 'amount'),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
