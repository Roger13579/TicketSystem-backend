import { IGoogleUser } from '../../types/user.type';

export class GoogleProfileDto {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _email: string;
  private readonly _picture: string;

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get picture(): string {
    return this._picture;
  }

  constructor(googleUser: IGoogleUser) {
    const { id, name, email, image } = googleUser.body;
    this._id = id;
    this._name = name;
    this._email = email;
    this._picture = image;
  }
}
