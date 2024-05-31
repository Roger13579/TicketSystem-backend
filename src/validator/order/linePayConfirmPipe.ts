import { query } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class LinePayConfirmPipe extends PipeBase {
  public transform = () => [
    query('orderId')
      .exists()
      .isString()
      .withMessage(CustomResponseType.LINEPAY_ERROR_MESSAGE),
    query('transactionId')
      .exists()
      .isString()
      .withMessage(CustomResponseType.LINEPAY_ERROR_MESSAGE),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
