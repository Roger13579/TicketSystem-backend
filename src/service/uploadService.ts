import { NextFunction, Response } from 'express';
import { UploadFileDTO } from '../dto/uploadFileDto';
import { UploadRepository } from '../repository/uploadRepository';
import { AppError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { HttpStatus } from '../types/responseType';

export class UploadService {
  private readonly uploadRepository: UploadRepository = new UploadRepository();

  public uploadFile = async (
    uploadFileDto: UploadFileDTO,
    res: Response,
    next: NextFunction,
  ) => {
    const { file, name } = uploadFileDto;
    if (!file) {
      return next(
        new AppError(
          CustomResponseType.INVALID_UPLOAD,
          HttpStatus.BAD_REQUEST,
          CustomResponseType.INVALID_UPLOAD_MESSAGE + '上傳檔案不得為空',
        ),
      );
    }
    return await this.uploadRepository.uploadFile(file, name, next);
  };
}
