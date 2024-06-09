import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class VerifyTicketsPipe extends PipeBase {
  public transform = () => [
    body('tickets')
      .exists()
      .isArray({ min: 1 })
      .withMessage(
        CustomResponseType.INVALID_VERIFIED_TICKET_MESSAGE + 'tickets',
      ),
    this.nonEmptyStringValidation(
      body('tickets.*.productId'),
      CustomResponseType.INVALID_VERIFIED_TICKET_MESSAGE + 'productId',
    ),
    this.nonEmptyStringValidation(
      body('tickets.*.userId'),
      CustomResponseType.INVALID_VERIFIED_TICKET_MESSAGE + 'userId',
    ),
    this.nonEmptyStringValidation(
      body('tickets.*.ticketId'),
      CustomResponseType.INVALID_VERIFIED_TICKET_MESSAGE + 'ticketId',
    ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
