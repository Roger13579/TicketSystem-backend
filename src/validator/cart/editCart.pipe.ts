import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import {
  EditCartType,
  IEditCartPrevItem,
  IEditCartReq,
} from '../../types/cart.type';
import { TCustomValidator } from '../index.type';
import { uniq } from 'lodash';

export class EditCartPipe extends PipeBase {
  private validateAmount: TCustomValidator<number> = (value, { req, path }) => {
    const matchPath = path.match(/\d+/);

    if (matchPath) {
      const index = Number(matchPath[0]);
      const { type } = (req as IEditCartReq).body.products[index];
      const isSetNegativeAmount = type === EditCartType.set && value < 1;
      const isNonIncAmount = type === EditCartType.inc && value === 0;
      const isInvalid = isSetNegativeAmount || isNonIncAmount;
      return !isInvalid;
    }

    return false;
  };

  private validateProductUniq: TCustomValidator<IEditCartPrevItem[]> = (
    value,
  ) => {
    const productIds = value.map(({ productId }) => productId);
    return productIds.length === uniq(productIds).length;
  };

  public transform = () => [
    body('products')
      .exists()
      .isArray({ min: 1 })
      .withMessage(CustomResponseType.INVALID_ADD_CART_MESSAGE + 'products')
      .custom(this.validateProductUniq)
      .withMessage(
        CustomResponseType.INVALID_ADD_CART_MESSAGE +
          '不可對同 productId 商品進行重複操作',
      ),
    this.nonEmptyStringValidation(
      body('products.*.productId'),
      CustomResponseType.INVALID_ADD_CART_MESSAGE + 'productId',
    ),
    body('products.*.type')
      .exists()
      .withMessage(CustomResponseType.INVALID_ADD_CART_MESSAGE + 'type')
      .isIn(Object.keys(EditCartType))
      .withMessage(CustomResponseType.INVALID_ADD_CART_MESSAGE + 'type'),
    body('products.*.amount')
      .exists()
      .custom(this.validateAmount)
      .withMessage(CustomResponseType.INVALID_ADD_CART_MESSAGE + 'amount')
      .isInt()
      .withMessage(CustomResponseType.INVALID_ADD_CART_MESSAGE + 'amount'),

    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
