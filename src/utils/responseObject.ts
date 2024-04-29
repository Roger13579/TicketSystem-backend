import { CustomResponseType } from '../types/customResponseType';

export class ResponseObject {

    public readonly status: CustomResponseType = CustomResponseType.SYSTEM_ERROR;
    public readonly message: string = '';
    public readonly data: any = null;

    constructor(options: { status?: CustomResponseType, message?: string, data?: any } = {}) {
        this.status = options.status || this.status;
        this.message = options.message || this.message;
        this.data = options.data || this.data;
    }
}
