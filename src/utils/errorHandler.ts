import { Error } from 'mongoose';

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

export { AppError };
