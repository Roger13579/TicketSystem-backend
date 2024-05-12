import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { Request } from 'express';
import { validationResult } from 'express-validator';

export abstract class BaseController {
  public formatResponse<T>(
    message: string,
    status = CustomResponseType.SYSTEM_ERROR,
    data?: T,
  ): ResponseObject {
    const options = {
      status,
      message,
      data,
    };
    return new ResponseObject(options);
  }
  public paramVerify(req: Request): ResponseObject | void {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return this.formatResponse(
        result.array()[0].msg,
        CustomResponseType.FORMAT_ERROR,
      );
    }
  }
}
