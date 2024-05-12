import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';
import { Request } from 'express';
import { validationResult } from 'express-validator';

export abstract class BaseController {
  public formatResponse(
    message: string,
    status = CustomResponseType.SYSTEM_ERROR,
    data: any = {},
  ): ResponseObject {
    const options: any = {
      status: status,
      message: message,
      data: data,
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
