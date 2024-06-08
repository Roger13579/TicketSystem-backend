import { UploadService } from '../service/uploadService';
import { IUploadFileReq } from '../types/upload.type';
import { BaseController } from './baseController';
import { CustomResponseType } from '../types/customResponseType';
import { TMethod } from '../types/common.type';
import { UploadFileDTO } from '../dto/upload/uploadFileDto';

class UploadController extends BaseController {
  private readonly uploadService: UploadService = new UploadService();

  public uploadFile: TMethod<IUploadFileReq> = async (req, _res, next) => {
    const uploadFileDto = new UploadFileDTO(req);
    const url = await this.uploadService.uploadFile(uploadFileDto, next);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { url },
    );
  };
}

export default UploadController;
