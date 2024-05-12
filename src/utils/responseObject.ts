import { CustomResponseType } from '../types/customResponseType';

export class ResponseObject {
  public readonly status: CustomResponseType = CustomResponseType.SYSTEM_ERROR;
  public readonly message: string = '';
  public readonly data: unknown = null;

  constructor(
    options: {
      status?: CustomResponseType;
      message?: string;
      data?: unknown;
    } = {},
  ) {
    this.status = options.status || this.status;
    this.message = options.message || this.message;
    this.data = options.data || this.data;
  }
}
