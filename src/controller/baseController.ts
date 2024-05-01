import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';

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
}
