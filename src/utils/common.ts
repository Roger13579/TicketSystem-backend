import { throwError } from './errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { forEach } from 'lodash';

export const collectionName = (model: string) => model.toLowerCase() + 's';

/**
 * @description 比較日期，如果其中一个日期是 undefined，則認為它比另一个日期大
 */
const compareDates = (date1: Date | undefined, date2: Date | undefined) => {
  if (!date1 || !date2) {
    return 0;
  }
  return date1.getTime() - date2.getTime();
};

/**
 * @description 時間順序判斷
 */
export const checkDateOrder = (...dates: { prop: string; value?: Date }[]) => {
  forEach(dates, ({ value, prop }, index) => {
    if (
      index < dates.length - 1 &&
      compareDates(value, dates[index + 1].value) > 0
    ) {
      throwError(
        `${CustomResponseType.INVALID_TIME_ORDER_MESSAGE}: ${prop} => ${value} / ${dates[index + 1].prop} => ${dates[index + 1].value}`,
        CustomResponseType.INVALID_TIME_ORDER,
      );
    }
  });
};
