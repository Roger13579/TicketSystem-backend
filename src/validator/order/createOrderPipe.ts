import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import { PaymentMethod } from '../../types/order.type';

export class CreateOrderPipe extends PipeBase {
  public transform = () => [
    body('items')
      .isArray()
      .custom((item: object[]) => item.length > 0)
      .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'items'),
    body('items.*.productId')
      .exists()
      .isString()
      .withMessage(
        CustomResponseType.FORMAT_ERROR_MESSAGE + 'items.*.productId',
      ),
    body('items.*.amount')
      .exists()
      .isInt({ min: 1 })
      .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'items.*.amount'),
    body('price')
      .exists()
      .isInt({ min: 1 })
      .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'price'),
    body('paymentMethod')
      .isIn(Object.keys(PaymentMethod))
      .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'paymentMethod'),
    body('deliveryInfo.name')
      .if(body('deliveryInfo').exists())
      .isString()
      .withMessage(
        CustomResponseType.FORMAT_ERROR_MESSAGE + 'deliveryInfo.name',
      ),
    body('deliveryInfo.address')
      .if(body('deliveryInfo').exists())
      .isString()
      .withMessage(
        CustomResponseType.FORMAT_ERROR_MESSAGE + 'deliveryInfo.address',
      ),
    body('deliveryInfo.phone')
      .if(body('deliveryInfo').exists())
      .isString()
      .withMessage(
        CustomResponseType.FORMAT_ERROR_MESSAGE + 'deliveryInfo.phone',
      ),
    body('deliveryInfo.email')
      .if(body('deliveryInfo').exists())
      .isEmail()
      .withMessage(
        CustomResponseType.FORMAT_ERROR_MESSAGE + 'deliveryInfo.email',
      ),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
