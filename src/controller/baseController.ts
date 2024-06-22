import { CustomResponseType } from '../types/customResponseType';
import { ResponseObject } from '../utils/responseObject';

export abstract class BaseController {
  /**
   * @description 如果 data 裡面有 specific_redirect_url 則要轉址
   */
  public formatResponse(
    message: string,
    status = CustomResponseType.SYSTEM_ERROR,
    data?: unknown,
  ) {
    const options = {
      status,
      message,
      ...(Object.keys(data || {}).length > 0 && { data }),
    };
    return new ResponseObject(options);
  }
}
