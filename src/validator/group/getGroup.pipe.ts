import { PipeBase } from '../pipe.base';
import { query } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import { GroupSortField, GroupStatus } from '../../types/group.type';
import { OptionType } from '../index.type';
import { SortOrder } from '../../types/common.type';
import { booleanStrings, nullableOption } from '../../utils/constants';

export class GetGroupsPipe extends PipeBase {
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
    query('startTime')
      .exists()
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'startTime',
      ),
    query('endTime')
      .exists()
      .withMessage(CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'endTime'),
    query('startDate')
      .exists()
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'startDate',
      ),
    query('endDate')
      .exists()
      .withMessage(CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'endDate'),
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
