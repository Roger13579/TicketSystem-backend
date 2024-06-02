import { throwError } from './errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import moment from 'moment';
import { SortOrder } from '../types/common.type';

export const areTimesInOrder = (
  times: {
    value?: Date;
    name: string;
  }[],
  order: SortOrder,
): boolean => {
  const isOrdered = (
    currentTime: moment.Moment,
    previousTime: moment.Moment,
  ) =>
    order === SortOrder.asc
      ? currentTime.isAfter(previousTime)
      : currentTime.isBefore(previousTime);

  for (let i = 1; i < times.length; i++) {
    const currentTime = times[i].value ? moment(times[i].value) : null;
    const previousTime = times[i - 1].value ? moment(times[i - 1].value) : null;

    if (!currentTime || !previousTime) continue;

    if (!isOrdered(currentTime, previousTime)) {
      throwError(
        `${CustomResponseType.INVALID_TIME_ORDER_MESSAGE} (${order}): ${times[i - 1].name} => ${times[i - 1].value} / ${times[i].name} => ${times[i].value}`,
        CustomResponseType.INVALID_TIME_ORDER,
      );
    }
  }
  return true;
};
