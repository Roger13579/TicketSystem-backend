import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class DeleteTicketsPipe extends PipeBase {
  public transform = () => [
    body('ticketIds')
      .exists()
      .isArray({ min: 1 })
      .withMessage(
        CustomResponseType.INVALID_TICKET_DELETE_MESSAGE + 'ticketIds',
      ),
    this.nonEmptyStringValidation(
      body('ticketIds.*'),
      CustomResponseType.INVALID_TICKET_DELETE_MESSAGE + 'ticketId',
    ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
