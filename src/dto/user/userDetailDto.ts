import { IUser } from '../../models/user';
import { Gender, IUpdateUserDetailReq } from '../../types/user.type';

export class UserDetailDto {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _birthDate: Date;
  private readonly _gender: Gender;
  private readonly _phone: string;
  private readonly _address: string;
  private readonly _avatarPath: string;

  get avatarPath(): string {
    return this._avatarPath;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get birthDate(): Date {
    return this._birthDate;
  }

  get gender(): Gender {
    return this._gender;
  }

  get phone(): string {
    return this._phone;
  }

  get address(): string {
    return this._address;
  }

  constructor(req: IUpdateUserDetailReq) {
    this._id = (req.user as IUser).id.toString();
    const { name, birthDate, gender, phone, address, imgUrl } = req.body;
    this._name = name;
    this._birthDate = birthDate;
    this._gender = gender;
    this._phone = phone;
    this._address = address;
    this._avatarPath = imgUrl;
  }
}
