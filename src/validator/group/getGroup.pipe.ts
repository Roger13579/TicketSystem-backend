import { PipeBase } from '../pipe.base';
import { Meta, query } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import {
  GroupSortBy,
  GroupStatus,
  IGetGroupsReq,
} from '../../types/group.type';
import moment from 'moment/moment';

export class GetGroupsPipe extends PipeBase {
  public transform = () => [
    query('limit')
      .exists()
      .withMessage(CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'limit'),
    query('page')
      .exists()
      .toInt()
      .withMessage(CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'page')
      .isInt({ min: 1 })
      .withMessage(CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'page'),
    query('hasTicket')
      .optional()
      .isIn(['true', 'false'])
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'hasTicket',
      ),
    query('status')
      .optional()
      .isIn(Object.keys(GroupStatus))
      .withMessage(CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'status'),
    query('sortBy')
      .optional()
      .custom((value: string | undefined) =>
        this.isValidOption(value, 'item', GroupSortBy),
      )
      .withMessage(CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'sortBy'),
    query('startAt')
      .optional()
      .custom(this.isValidDate)
      .withMessage(CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'startAt')
      .custom((value: string, { req }: Meta) => {
        const { endAt } = (req as IGetGroupsReq).query;
        if (endAt && this.isValidDate(value) && this.isValidDate(endAt)) {
          return moment(endAt).isAfter(moment(value));
        }
        return true;
      })
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'startAtTo',
      ),
    query('endAt')
      .optional()
      .custom(this.isValidDate)
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'startAtTo',
      )
      .custom((value: string, { req }: Meta) => {
        const { startAt } = (req as IGetGroupsReq).query;
        if (startAt && this.isValidDate(value) && this.isValidDate(startAt)) {
          return moment(startAt).isBefore(moment(value));
        }
        return true;
      })
      .withMessage(
        CustomResponseType.INVALID_GROUP_FILTER_MESSAGE + 'startAtTo',
      ),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
