import { PipeBase } from '../pipe.base';
import { query } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import { GroupType } from '../../types/group.type';
import { OptionType } from '../index.type';
import { SortOrder } from '../../types/common.type';

export class GetUserGroupPipe extends PipeBase {
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
