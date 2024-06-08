import path from 'path';
import { IUser } from '../../models/user';
import { IUploadFileReq } from '../../types/upload.type';

export class UploadFileDTO {
  private readonly _file: Express.Multer.File;
  private readonly _name: string;

  get file() {
    return this._file;
  }
  get name() {
    return this._name;
  }

  constructor(req: IUploadFileReq) {
    const { files, params, user } = req;
    this._file = files[0];
    this._name = `${params.type}/${params.category}/${(user as IUser)._id}${path.extname(files[0].originalname).toLowerCase()}`;
  }
}
