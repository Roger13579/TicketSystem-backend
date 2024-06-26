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
  private validateExpiredAtFrom: TCustomValidator = (value, { req }) => {
    const { expiredAtTo } = (req as IGetTicketsReq).query;
    return this.validatePeriod(value, expiredAtTo, (a, b) => a.isBefore(b));
  };

  private validateExpiredAtTo: TCustomValidator = (value, { req }) => {
    const { expiredAtFrom } = (req as IGetTicketsReq).query;
    return this.validatePeriod(expiredAtFrom, value, (a, b) => a.isBefore(b));
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
    query('isPublished')
      .optional()
      .isIn(booleanStrings)
      .withMessage(
        CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'isPublished',
      ),
    query('sortField')
      .optional()
      .custom(this.validateOption(OptionType.item, TicketSortField))
      .withMessage(
        CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'sortField',
      ),
    query('sortOrder')
      .optional()
      .custom(this.validateOption(OptionType.item, SortOrder))
      .withMessage(
        CustomResponseType.INVALID_TICKET_FILTER_MESSAGE + 'sortOrder',
      ),
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
