import { PipeBase, booleanStrings } from '../pipe.base';
import { query } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import {
  GroupSortField,
  GroupStatus,
  IGetGroupsReq,
} from '../../types/group.type';
import { OptionType, TCustomValidator } from '../index.type';
import { SortOrder } from '../../types/common.type';

export class GetGroupsPipe extends PipeBase {
  private validateStartAt: TCustomValidator<string | undefined> = (
    value,
    { req },
  ) => {
    const { endAt } = (req as IGetGroupsReq).query;
    return this.validatePeriod(value, endAt, (a, b) => a.isBefore(b));
  };

  private validateEndAt: TCustomValidator<string | undefined> = (
    value,
    { req },
  ) => {
    const { startAt } = (req as IGetGroupsReq).query;
    return this.validatePeriod(value, startAt, (a, b) => a.isAfter(b));
  };

  public transform = () => [
    this.limitValidation(
      query('limit'),
      CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'limit',
    ),
    this.positiveIntValidation(
      query('page'),
      CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'page',
    ),
    query('title')
      .optional()
      .isString()
      .withMessage(CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'title'),
    query('hasTicket')
      .optional()
      .isIn(booleanStrings)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'hasTicket',
      ),
    query('movieTitle')
      .optional()
      .isString()
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'movieTitle',
      ),
    query('status')
      .optional()
      .isIn(Object.keys(GroupStatus))
      .withMessage(CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'status'),
    query('participantCount')
      .optional()
      .isInt({ min: 1 })
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'participantCount',
      ),
    query('startAt')
      .optional()
      .custom(this.validateDate)
      .custom(this.validateStartAt)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'startAtTo',
      ),
    query('endAt')
      .optional()
      .custom(this.validateDate)
      .custom(this.validateEndAt)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'startAtTo',
      ),
    query('sortField')
      .optional()
      .custom(this.validateOption(OptionType.item, GroupSortField))
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'sortField',
      ),
    query('sortOrder')
      .optional()
      .custom(this.validateOption(OptionType.item, SortOrder))
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'sortOrder',
      ),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
