import { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { CustomResponseType } from '../types/customResponseType';
import { throwError } from '../utils/errorHandler';

export abstract class PipeBase {
  public abstract transform(): any[];

  protected validationHandler(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const arr = errors.array();
      throwError(arr[0].msg, CustomResponseType.FORMAT_ERROR);
    }
    next();
  }
}
