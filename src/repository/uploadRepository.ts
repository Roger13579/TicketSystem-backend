import { NextFunction } from 'express';
import firebaseAdmin from '../utils/firebase';
import { AppError } from '../utils/errorHandler';
import { HttpStatus } from '../types/responseType';
import { CustomResponseType } from '../types/customResponseType';

const storage = firebaseAdmin.storage();
const bucket = storage.bucket();

const blobConfig = {
  action: 'read' as const,
  expires: '12-31-2500',
};

export class UploadRepository {
  public uploadFile = async (
    file: Express.Multer.File,
    name: string,
    next: NextFunction,
  ) => {
    const blob = bucket.file(name);
    return await new Promise<string>((resolve, reject) => {
      const blobStream = blob.createWriteStream();

      blobStream
        .on('finish', () => {
          blob.getSignedUrl(blobConfig, (err, url) => {
            if (err || !url) {
              reject(
                new AppError(
                  CustomResponseType.INVALID_UPLOAD,
                  HttpStatus.BAD_REQUEST,
                  CustomResponseType.INVALID_UPLOAD_MESSAGE +
                    '檔案 URL 取得失敗',
                ),
              );
            } else {
              resolve(url);
            }
          });
        })
        .on('error', () => {
          reject(
            next(
              new AppError(
                CustomResponseType.INVALID_UPLOAD,
                HttpStatus.BAD_REQUEST,
                CustomResponseType.INVALID_UPLOAD_MESSAGE + '檔案上傳失敗',
              ),
            ),
          );
        })
        .end(file.buffer);
    });
  };
}
