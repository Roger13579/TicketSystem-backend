import { query } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class LinePayConfirmPipe extends PipeBase {
  public transform = () => [
    this.nonEmptyStringValidation(
      query('orderId'),
      CustomResponseType.LINEPAY_ERROR_MESSAGE,
    ),
    this.nonEmptyStringValidation(
      query('transactionId'),
      CustomResponseType.LINEPAY_ERROR_MESSAGE,
    ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
