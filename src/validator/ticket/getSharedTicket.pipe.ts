import { PipeBase } from '../pipe.base';
import { query } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';

export class GetSharedTicketPipe extends PipeBase {
  public transform = () => [
    this.limitValidation(
      query('limit'),
      CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'limit',
    ),
    this.positiveIntValidation(
      query('page'),
      CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'page',
    ),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
