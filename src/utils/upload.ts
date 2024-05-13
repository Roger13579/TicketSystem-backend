import multer from 'multer';
import path from 'path';
import { IUserReq } from '../types/common.type';
import { AppError } from './errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { HttpStatus } from '../types/responseType';

const validExts = ['.jpg', '.png', '.jpeg'];

const limits = {
  fileSize: 2 * 1024 * 1024,
};

const fileFilter = (
  req: IUserReq,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!validExts.includes(ext)) {
    return callback(
      new AppError(
        CustomResponseType.INVALID_UPLOAD,
        HttpStatus.BAD_REQUEST,
        CustomResponseType.INVALID_UPLOAD_MESSAGE +
          '檔案格式錯誤，僅限 jpg / png / jpeg 檔',
      ),
    );
  }

  return callback(null, true);
};

export const uploadFile = multer({ limits, fileFilter }).any();
