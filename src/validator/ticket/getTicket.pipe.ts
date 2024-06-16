import { PipeBase } from '../pipe.base';
import { query } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import { OptionType, TCustomValidator } from '../index.type';
import {
  IGetTicketsReq,
  TicketSortField,
  TicketStatus,
} from '../../types/ticket.type';
import { SortOrder } from '../../types/common.type';
import { booleanStrings } from '../../utils/constants';

export class GetTicketPipe extends PipeBase {
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
