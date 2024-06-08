import { NextFunction } from 'express';
import { UploadRepository } from '../repository/uploadRepository';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { UploadFileDTO } from '../dto/upload/uploadFileDto';

export class UploadService {
  private readonly uploadRepository: UploadRepository = new UploadRepository();

  public uploadFile = async (
    uploadFileDto: UploadFileDTO,
    next: NextFunction,
  ) => {
    const { file, name } = uploadFileDto;
    if (!file) {
      throwError(
        CustomResponseType.INVALID_UPLOAD_MESSAGE + '上傳檔案不得為空',
        CustomResponseType.INVALID_UPLOAD,
      );
      return;
    }
    return await this.uploadRepository.uploadFile(file, name, next);
  };
}
