import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class TransferTicketPipe extends PipeBase {
  public transform = () => [
    this.nonEmptyStringValidation(
      body('ticketId'),
      CustomResponseType.TRANSFER_TICKET_CREATE_ERROR_MESSAGE + 'ticketId',
    ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
