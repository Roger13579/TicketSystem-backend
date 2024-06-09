import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class ClaimTransferTicketPipe extends PipeBase {
  public transform = () => [
    this.nonEmptyStringValidation(
      body('shareCode'),
      CustomResponseType.TRANSFER_TICKET_ERROR_MESSAGE + 'shareCode',
    ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
