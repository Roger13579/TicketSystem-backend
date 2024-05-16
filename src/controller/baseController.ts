import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';

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
}
