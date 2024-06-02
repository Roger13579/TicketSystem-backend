import { Meta, body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import { EditCartType, IEditCartProductReq } from '../../types/cart.type';

export class EditCartProductPipe extends PipeBase {
  public transform = () => [
    this.nonEmptyStringValidation(
      body('productId'),
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
      .custom((value: number, { req }: Meta) => {
        const { type } = (req as IEditCartProductReq).body;

        const invalidSet = type === EditCartType.set && value < 1;

        return !invalidSet;
      })
      .withMessage(CustomResponseType.INVALID_ADD_CART_MESSAGE + 'amount'),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
