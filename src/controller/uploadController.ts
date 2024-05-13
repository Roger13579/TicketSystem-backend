import { NextFunction, Response } from 'express';
import { UploadService } from '../service/uploadService';
import { IUploadFileReq } from '../types/upload.type';
import { BaseController } from './baseController';
import { UploadFileDTO } from '../dto/uploadFileDto';
import { CustomResponseType } from '../types/customResponseType';
import { Request } from 'express';

class UploadController extends BaseController {
  private readonly uploadService: UploadService = new UploadService();

  public uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const uploadFileDto = new UploadFileDTO(req as IUploadFileReq);
    const url = await this.uploadService.uploadFile(uploadFileDto, res, next);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { url },
    );
  };
}

export default UploadController;
