import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';

export abstract class BaseController {
  public formatResponse(
    data: any,
    status = CustomResponseType.SYSTEM_ERROR,
  ): ResponseObject {
    const options: any = { status: status };
    status > '6000' ? (options.message = data) : (options.data = data);
    return new ResponseObject(options);
  }
}
