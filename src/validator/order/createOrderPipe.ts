import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import { PaymentMethod } from '../../types/order.type';

export class CreateOrderPipe extends PipeBase {
  public transform = () => [
    body('items')
      .exists()
      .isArray({ min: 1 })
      .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'items'),
    this.nonEmptyStringValidation(
      body('items.*.productId'),
      CustomResponseType.FORMAT_ERROR_MESSAGE + 'items.*.productId',
    ),
    this.planValidation.discount(
      body('items.*.plan.discount'),
      CustomResponseType.FORMAT_ERROR_MESSAGE + 'items.*.plan.discount',
    ),
    this.nonEmptyStringValidation(
      body('items.*.plan.name'),
      'items.*.plan.name',
    ),
    this.planValidation.headCount(
      body('items.*.plan.headCount'),
      CustomResponseType.FORMAT_ERROR_MESSAGE + 'items.*.plan.headCount',
    ),
    this.positiveIntValidation(
      body('items.*.amount'),
      CustomResponseType.FORMAT_ERROR_MESSAGE + 'items.*.amount',
    ),
    this.positiveIntValidation(
      body('price'),
      CustomResponseType.FORMAT_ERROR_MESSAGE + 'price',
    ),
    body('paymentMethod')
      .exists()
      .isIn(Object.keys(PaymentMethod))
      .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'paymentMethod'),
    this.nonEmptyStringValidation(
      body('deliveryInfo.name').if(body('deliveryInfo')),
      CustomResponseType.FORMAT_ERROR_MESSAGE + 'deliveryInfo.name',
    ),
    this.nonEmptyStringValidation(
      body('deliveryInfo.address').if(body('deliveryInfo')),
      CustomResponseType.FORMAT_ERROR_MESSAGE + 'deliveryInfo.address',
    ),
    this.nonEmptyStringValidation(
      body('deliveryInfo.phone').if(body('deliveryInfo')),
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
