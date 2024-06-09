import { PipeBase } from '../pipe.base';
import { param } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';

export class GetTicketDetailPipe extends PipeBase {
  public transform() {
    return [
      param('id')
        .exists()
        .withMessage(CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'id'),
      this.validationHandler,
    ];
  }
  constructor() {
    super();
  }
}
