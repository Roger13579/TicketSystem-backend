import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class TransferTicketPipe extends PipeBase {
  public transform = () => [
    this.nonEmptyStringValidation(
      body('orderId'),
      CustomResponseType.TRANSFER_TICKET_CREATE_ERROR_MESSAGE + 'orderId',
    ),
    this.nonEmptyStringValidation(
      body('productId'),
      CustomResponseType.TRANSFER_TICKET_CREATE_ERROR_MESSAGE + 'productId',
    ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
