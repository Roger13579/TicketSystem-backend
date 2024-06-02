import { booleanStrings, PipeBase } from '../pipe.base';
import { query } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import { OptionType, TCustomValidator } from '../index.type';
import {
  IGetTicketsReq,
  TicketSortField,
  TicketStatus,
} from '../../types/ticket.type';

export class GetTicketPipe extends PipeBase {
  private validateExpiredAtFrom: TCustomValidator = (value, { req }) => {
    const { expiredAtTo } = (req as IGetTicketsReq).query;
    return this.validatePeriod(value, expiredAtTo, (a, b) => b.isAfter(a));
  };

  private validateExpiredAtTo: TCustomValidator = (value, { req }) => {
    const { expiredAtFrom } = (req as IGetTicketsReq).query;
    return this.validatePeriod(value, expiredAtFrom, (a, b) => a.isBefore(b));
  };

  public transform = () => [
    this.limitValidation(
      query('limit'),
      CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'limit',
    ),
    this.positiveIntValidation(
      query('page'),
      CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'page',
    ),
    query('ids')
      .custom(this.isAdminOnly)
      .withMessage(
        CustomResponseType.INVALID_TICKET_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'ids',
      ),
    query('productName')
      .custom(this.isAdminOnly)
      .withMessage(
        CustomResponseType.INVALID_TICKET_FILTER_MESSAGE +
          CustomResponseType.PERMISSION_DENIED_MESSAGE +
          'productName',
      ),
    query('expiredAtFrom')
      .optional()
      .custom(this.validateDate)
      .withMessage(
        CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'expiredAtFrom',
      )
      .custom(this.validateExpiredAtFrom)
      .withMessage(
        CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'expiredAtFrom',
      ),
    query('expiredAtTo')
      .optional()
      .custom(this.validateDate)
      .withMessage(
        CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'expiredAtTo',
      )
      .custom(this.validateExpiredAtTo)
      .withMessage(
        CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'expiredAtTo',
      ),
    query('isShared')
      .optional()
      .isIn(booleanStrings)
      .withMessage(
        CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'isPublic',
      ),
    query('sortBy')
      .optional()
      .custom(this.validateOption(OptionType.item, TicketSortField))
      .withMessage(CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'sortBy'),

    query('status')
      .optional()
      .isIn(Object.keys(TicketStatus))
      .withMessage(CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'status'),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
