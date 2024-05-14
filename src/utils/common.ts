import moment from 'moment';
import { throwError } from './errorHandler';
import { CustomResponseType } from '../types/customResponseType';

export const parseValidEnums = <T extends Record<string, string>>(
  prop: string,
  enumType: T,
  value?: string,
): T[keyof T][] | undefined => {
  if (!value) return undefined;
  const validValues: T[keyof T][] = [];
  value.split(',').forEach((value: string) => {
    if (Object.values(enumType).includes(value)) {
      validValues.push(value as T[keyof T]);
    } else {
      throwError(
        `${CustomResponseType.INVALID_PRODUCT_FILTER_MESSAGE}${prop} 不得為 ${value}`,
        CustomResponseType.INVALID_PRODUCT_FILTER,
      );
    }
  });
  return validValues;
};

export const parseBoolean = (prop: string, value?: string) => {
  if (!value) {
    return undefined;
  }
  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  } else {
    throwError(
      CustomResponseType.INVALID_BOOLEAN_MESSAGE + `: ${prop} => ${value}`,
      CustomResponseType.INVALID_BOOLEAN,
    );
  }
};

export const parseDate = (prop: string, value?: string) => {
  if (!value) {
    return undefined;
  }
  const parseDate = moment(value);
  if (parseDate.isValid()) {
    return parseDate.toDate();
  } else {
    throwError(
      CustomResponseType.INVALID_TIME_MESSAGE + `: ${prop} => ${value}`,
      CustomResponseType.INVALID_TIME,
    );
  }
};

export const parsePositiveInteger = (prop: string, value?: string) => {
  if (!value) {
    return undefined;
  }
  const parseNum = Number(value);
  if (!Number.isNaN(value) && parseNum >= 0 && Number.isInteger(parseNum)) {
    return parseNum;
  } else {
    throwError(
      CustomResponseType.INVALID_NUMBER_MESSAGE + `: ${prop} => ${value}`,
      CustomResponseType.INVALID_NUMBER,
    );
  }
};

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
  for (let i = 0; i < dates.length - 1; i++) {
    if (compareDates(dates[i].value, dates[i + 1].value) > 0) {
      throwError(
        CustomResponseType.INVALID_TIME_ORDER_MESSAGE +
          `: ${dates[i].prop} => ${dates[i].value} / ${dates[i + 1].prop} => ${dates[i].value}`,
        CustomResponseType.INVALID_TIME_ORDER,
      );
    }
  }
};
