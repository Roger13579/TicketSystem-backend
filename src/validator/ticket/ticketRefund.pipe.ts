import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';

export class TicketRefundPipe extends PipeBase {
  public transform = () => [
    body('ticketId')
      .exists()
      .withMessage(
        CustomResponseType.INVALID_TICKET_REFUND_MESSAGE + 'ticketId',
      ),
    body('refundReason')
      .exists()
      .withMessage(
        CustomResponseType.INVALID_TICKET_REFUND_MESSAGE + 'refundReason',
      ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
