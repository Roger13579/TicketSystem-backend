import { PipeBase } from '../pipe.base';
import { query } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import { GroupType, IGetGroupsReq } from '../../types/group.type';
import { OptionType, TCustomValidator } from '../index.type';
import { SortOrder } from '../../types/common.type';

export class GetUserGroupPipe extends PipeBase {
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
    query('groupType')
      .exists()
      .isIn(Object.keys(GroupType))
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'groupType',
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
