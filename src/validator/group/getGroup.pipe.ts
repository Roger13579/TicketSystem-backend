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

const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:mm 格式
const dateFormat = /^\d{4}\/\d{2}\/\d{2}$/; // YYYY/MM/DD 格式

export class GetGroupsPipe extends PipeBase {
  private validateTimeRange: TCustomValidator = (value, { req }) => {
    const { startTime, endTime, startDate, endDate } = (req as IGetGroupsReq)
      .query;

    const hasTimeRange = !!startTime && !!endTime && !!startDate && !!endDate;
    const hasNoTimeRange = !startTime && !endTime && !startDate && !endDate;

    return hasTimeRange || hasNoTimeRange;
  };

  private validateTimeFormat: TCustomValidator<string> = (value) =>
    timeFormat.test(value);

  private validateDateFormat: TCustomValidator<string> = (value) =>
    dateFormat.test(value);

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
      .optional()
      .custom(this.validateTimeFormat)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'startTime 格式錯誤',
      )
      .custom(this.validateTimeRange)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE +
          '使用時間區段搜尋時，startTime、endTime、startDate、endDate 皆為必填',
      ),
    query('endTime')
      .optional()
      .custom(this.validateTimeFormat)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'endTime 格式錯誤',
      )
      .custom(this.validateTimeRange)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE +
          '使用時間區段搜尋時，startTime、endTime、startDate、endDate 皆為必填',
      ),
    query('startDate')
      .optional()
      .custom(this.validateDateFormat)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'startDate 格式錯誤',
      )
      .custom(this.validateTimeRange)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE +
          '使用時間區段搜尋時，startTime、endTime、startDate、endDate 皆為必填',
      ),
    query('endDate')
      .optional()
      .custom(this.validateDateFormat)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'endDate 格式錯誤',
      )
      .custom(this.validateTimeRange)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE +
          '使用時間區段搜尋時，startTime、endTime、startDate、endDate 皆為必填',
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
