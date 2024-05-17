import { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { CustomResponseType } from '../types/customResponseType';
import { throwError } from '../utils/errorHandler';

export abstract class PipeBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public abstract transform(): any;

  protected isValidDate = (value: string) => {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
  };

  protected isNotEmptyArray = (array: unknown[]) => array.length > 0;

  protected validationHandler(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const arr = errors.array();
      throwError(arr[0].msg, CustomResponseType.FORMAT_ERROR);
    }
    next();
  }
  protected constructor() {}
}
