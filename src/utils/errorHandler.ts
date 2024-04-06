import { Request, Response, NextFunction } from 'express';
import log4js from '../config/log4js';
const logger = log4js.getLogger(`AppError`);

/**
 * @description - 負責將所以API的錯誤統一並回傳統一error格式
 * @param {Number} statusCode
 * @param {String} errName
 * @param {String} errMessage
 */
class AppError extends Error {
  get statusCode() {
    return this._statusCode;
  }

  set statusCode(value) {
    this._statusCode = value;
  }
  private _statusCode: number | undefined;

  constructor(statusCode: number, errName: string, errMessage: string) {
    super(errMessage);
    super.name = errName;
    this.statusCode = statusCode;
  }
}

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err) {
    logger.info('globalErrorHandler process');
    res.status(500).json({
      status: 'false',
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
};

const appErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err) {
    logger.info('appErrorHandler process');
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({
      status: 'false',
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
};

const unknownRouteError = (
  rreq: Request,
  res: Response,
  next: NextFunction,
) => {
  next(new AppError(404, '40401', '無此路由資訊'));
};

export { AppError, globalErrorHandler, appErrorHandler, unknownRouteError };
