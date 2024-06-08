import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';
import { CustomResponseType } from '../../types/customResponseType';
import { IEditTicketsReq } from '../../types/ticket.type';
import { TCustomValidator } from '../index.type';
import { validEditStatus } from '../../utils/ticket.constants';

export class EditTicketsPipe extends PipeBase {
  /**
   * @description 只能選一個 property 來編輯
   */
  private validateEditContent: TCustomValidator = (value, { req, path }) => {
    const matchPath = path.match(/\d+/);
    if (matchPath) {
      const index = Number(matchPath[0]);
      const ticket = (req as IEditTicketsReq).body.tickets[index];
      return Object.keys(ticket).length === 2;
    }
    return false;
  };

  public transform = () => [
    body('tickets')
      .exists()
      .isArray({ min: 1 })
      .withMessage(CustomResponseType.INVALID_EDIT_TICKET_MESSAGE + 'tickets'),
    this.nonEmptyStringValidation(
      body('tickets.*.ticketId'),
      CustomResponseType.INVALID_VERIFIED_TICKET_MESSAGE + 'ticketId',
    ),
    body('tickets.*.status')
      .optional()
      .isIn(validEditStatus)
      .withMessage(CustomResponseType.INVALID_EDIT_TICKET_MESSAGE + 'status'),
    body('tickets.*.isPublished')
      .optional()
      .isBoolean()
      .withMessage(
        CustomResponseType.INVALID_EDIT_TICKET_MESSAGE + 'isPublished',
      ),
    body('tickets.*.expiredAt')
      .optional()
      .custom(this.validateDate)
      .withMessage(
        CustomResponseType.INVALID_EDIT_TICKET_MESSAGE + 'expiredAt',
      ),
    body('tickets.*')
      .custom(this.validateEditContent)
      .withMessage(
        CustomResponseType.INVALID_EDIT_TICKET_MESSAGE +
          'expiredAt, isPublished, status 只能一次編輯一個',
      ),
    this.validationHandler,
  ];
  constructor() {
    super();
  }
}
