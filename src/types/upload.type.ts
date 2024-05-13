import { IUserReq } from './common.type';

export interface IUploadFileReq extends IUserReq {
  files: Express.Multer.File[];
  params: { type: FileType; category: FileCategory };
}

export enum FileCategory {
  product = 'product',
  user = 'user',
}

export enum FileType {
  photo = 'photo',
}
