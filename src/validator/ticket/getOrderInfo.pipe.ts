import { query } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class GetOrderInfoPipe extends PipeBase {
  public transform = () => [
    query('orderId')
      .exists()
      .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'orderId'),
    query('productId')
      .exists()
      .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'productId'),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
