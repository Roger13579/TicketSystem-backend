import { PipeBase } from '../pipe.base';
import { Meta, query } from 'express-validator';
import { CustomResponseType } from '../../types/customResponseType';
import moment from 'moment/moment';
import {
  IGetOrdersReq,
  OrderSortBy,
  PaymentStatus,
} from '../../types/order.type';

export class GetOrderPipe extends PipeBase {
  public transform = () => [
    query('limit')
      .exists()
      .withMessage(CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'limit'),
    query('page')
      .exists()
      .toInt()
      .withMessage(CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'page')
      .isInt({ min: 1 })
      .withMessage(CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'page'),
    query('sortBy')
      .optional()
      .custom((value: string | undefined) =>
        this.isValidOption(value, 'item', OrderSortBy),
      )
      .withMessage(CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'sortBy'),
    query('status')
      .optional()
      .isIn(Object.keys(PaymentStatus))
      .withMessage(CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'status'),
    query('createdAtFrom')
      .optional()
      .custom(this.isValidDate)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'createdAtFrom',
      )
      .custom((value: string, { req }: Meta) => {
        const { createdAtTo } = (req as IGetOrdersReq).query;
        if (
          createdAtTo &&
          this.isValidDate(value) &&
          this.isValidDate('createdAtTo')
        ) {
          return moment('createdAtTo').isAfter(moment(value));
        }
        return true;
      })
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'createdAtFrom',
      ),
    query('createdAtTo')
      .optional()
      .custom(this.isValidDate)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'createdAtTo',
      )
      .custom((value: string, { req }: Meta) => {
        const { createdAtFrom } = (req as IGetOrdersReq).query;
        if (
          createdAtFrom &&
          this.isValidDate(value) &&
          this.isValidDate('createdAtFrom')
        ) {
          return moment('createdAtFrom').isBefore(moment(value));
        }
        return true;
      })
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'createdAtTo',
      ),
    query('paidAtFrom')
      .optional()
      .custom(this.isValidDate)
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'paidAtFrom',
      )
      .custom((value: string, { req }: Meta) => {
        const { paidAtTo } = (req as IGetOrdersReq).query;
        if (paidAtTo && this.isValidDate(value) && this.isValidDate(paidAtTo)) {
          return moment(paidAtTo).isAfter(moment(value));
        }
        return true;
      })
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'paidAtFrom',
      ),
    query('paidAtTo')
      .optional()
      .custom(this.isValidDate)
      .withMessage(CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'paidAtTo')
      .custom((value: string, { req }: Meta) => {
        const { paidAtFrom } = (req as IGetOrdersReq).query;
        if (
          paidAtFrom &&
          this.isValidDate(value) &&
          this.isValidDate(paidAtFrom)
        ) {
          return moment(paidAtFrom).isBefore(moment(value));
        }
        return true;
      })
      .withMessage(
        CustomResponseType.INVALID_ORDER_FILTER_MESSAGE + 'paidAtTo',
      ),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
