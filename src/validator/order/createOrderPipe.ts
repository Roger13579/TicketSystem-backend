import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import { PaymentMethod } from '../../types/order.type';

export class CreateOrderPipe extends PipeBase {
  public transform = () => [
    body('userId')
      .exists()
      .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'userId'),
    body('products')
      .isArray()
      .custom((item: object[]) => item.length > 0)
      .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'products'),
    body('price')
      .exists()
      .isNumeric()
      .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'price'),
    body('paymentMethod')
      .isIn(Object.keys(PaymentMethod))
      .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'price'),
    body('deliveryInfo')
      .exists()
      .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'deliveryInfo'),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
