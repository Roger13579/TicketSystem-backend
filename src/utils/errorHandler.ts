import {
  TCustomMongoDBError,
  ICustomMongooseError,
  IThrowError,
} from '../types/common.type';

/**
 * @description - 負責將所以API的錯誤統一並回傳統一error格式
 * @param {Number} statusCode
 * @param {String} errName
 * @param {String} errMessage
 */
class AppError extends Error {
  get status() {
    return this._status;
  }

  set status(value: string | undefined) {
    this._status = value;
  }
  get statusCode() {
    return this._statusCode;
  }

  set statusCode(value: number | undefined) {
    this._statusCode = value;
  }
  private _statusCode: number | undefined;
  private _status: string | undefined;

  constructor(status: string, statusCode: number, errMessage: string) {
    super(errMessage);
    this.status = status;
    this.statusCode = statusCode;
  }
}

export const throwError = (message: string, code: string): Error => {
  const error: IThrowError = new Error(message);
  error.status = code;
  throw error;
};

export const createErrorMsg = (err: unknown) => {
  let errMsg: string = '';
  if ((err as TCustomMongoDBError).writeErrors) {
    // from mongodb
    // TODO: error type
    errMsg = (err as TCustomMongoDBError).writeErrors
      .map((subErr) => subErr.err.errmsg)
      .join('/');
  }
  if ((err as ICustomMongooseError).errors) {
    errMsg = (err as Error).message;
  }
  return errMsg;
};

export { AppError };
