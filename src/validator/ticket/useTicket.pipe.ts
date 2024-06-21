import { param } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class UseTicketPipe extends PipeBase {
  public transform = () => [
    param('ticketId')
      .exists()
      .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + 'ticketId'),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
