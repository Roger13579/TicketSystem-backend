import path from 'path';
import { IUser } from '../../models/user';
import { IUploadFileReq } from '../../types/upload.type';
import { v4 as uuidv4 } from 'uuid';

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
    this._name = `${params.type}/${params.category}/${(user as IUser)._id}${uuidv4() + path.extname(files[0].originalname).toLowerCase()}`;
  }
}
