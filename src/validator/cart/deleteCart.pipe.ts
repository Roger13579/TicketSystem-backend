import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import {
  DeleteCartType,
  ICartProduct,
  IDeleteCartReq,
} from '../../types/cart.type';
import { TCustomValidator } from '../index.type';
import { IPlan } from '../../types/product.type';

export class DeleteCartPipe extends PipeBase {
  private validateProducts: TCustomValidator<unknown> = (value, { req }) => {
    const { type } = (req as IDeleteCartReq).body;

    const isClearAll = type === DeleteCartType.all && !value;
    const requiredFields: (keyof ICartProduct)[] = ['productId', 'plan'];
    const requiredPlan: (keyof IPlan)[] = ['name', 'discount', 'headCount'];
    const isProductsArr =
      Array.isArray(value) &&
      value.every((item) =>
        this.allRequiredFieldsHaveValues(item, requiredFields),
      ) &&
      value.every((item) =>
        this.allRequiredFieldsHaveValues(item.plan, requiredPlan),
      );
    const isClearItems = type === DeleteCartType.items && isProductsArr;

    return isClearAll || isClearItems;
  };

  private allRequiredFieldsHaveValues<T extends object>(
    obj: T,
    requiredFields: (keyof T)[],
  ): boolean {
    return requiredFields.every(
      (field) =>
        Object.values(obj) !== null &&
        obj[field] !== undefined &&
        obj[field] !== '',
    );
  }
  public transform = () => [
    body('type')
      .exists()
      .isIn(Object.keys(DeleteCartType))
      .withMessage(CustomResponseType.INVALID_DELETE_CART_MESSAGE + 'type'),
    body('products')
      .custom(this.validateProducts)
      .withMessage(CustomResponseType.INVALID_DELETE_CART_MESSAGE + 'products'),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
