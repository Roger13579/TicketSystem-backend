import { PipeBase, booleanStrings } from '../pipe.base';
import { query } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import {
  GroupSortBy,
  GroupStatus,
  IGetGroupsReq,
} from '../../types/group.type';
import { OptionType, TCustomValidator } from '../index.type';

// 管理者和使用者都可以使用的

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
      .optional()
      .isIn(booleanStrings)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'hasTicket',
      ),
    query('status')
      .optional()
      .isIn(Object.keys(GroupStatus))
      .withMessage(CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'status'),
    query('sortBy')
      .optional()
      .custom(this.validateOption(OptionType.item, GroupSortBy))
      .withMessage(CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'sortBy'),
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
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
