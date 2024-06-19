import { PipeBase } from '../pipe.base';
import { query } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import {
  GroupSortField,
  GroupStatus,
  IGetGroupsReq,
} from '../../types/group.type';
import { OptionType, TCustomValidator } from '../index.type';
import { SortOrder } from '../../types/common.type';
import { booleanStrings, nullableOption } from '../../utils/constants';

export class GetGroupsPipe extends PipeBase {
  private validateStartAt: TCustomValidator = (value, { req }) => {
    const { endAt } = (req as IGetGroupsReq).query;
    return this.validatePeriod(value, endAt, (a, b) => a.isBefore(b));
  };

  private validateEndAt: TCustomValidator = (value, { req }) => {
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
    query('hasTicket')
      .optional(nullableOption)
      .isIn(booleanStrings)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'hasTicket',
      ),
    query('status')
      .optional(nullableOption)
      .isIn(Object.keys(GroupStatus))
      .withMessage(CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'status'),
    query('participantCount')
      .optional(nullableOption)
      .isInt({ min: 1 })
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'participantCount',
      ),
    query('startAt')
      .optional(nullableOption)
      .custom(this.validateDate)
      .custom(this.validateStartAt)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'startAtTo',
      ),
    query('endAt')
      .optional(nullableOption)
      .custom(this.validateDate)
      .custom(this.validateEndAt)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'startAtTo',
      ),
    query('sortField')
      .optional(nullableOption)
      .custom(this.validateOption(OptionType.item, GroupSortField))
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'sortField',
      ),
    query('sortOrder')
      .optional(nullableOption)
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
