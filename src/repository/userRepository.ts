import { UserModel, IUser } from '../models/user';
import { UserDetailDto } from '../dto/userDetailDto';
import { Types } from 'mongoose';

export class UserRepository {
  public async createUser(
    account: string,
    email: string,
    pwd: string,
  ): Promise<IUser> {
    return UserModel.create(
      new UserModel({
        email,
        account,
        pwd,
        accountType: 'member',
      }),
    );
  }

  public async updateUserDetail(
    userDetailDto: UserDetailDto,
  ): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      { _id: new Types.ObjectId(userDetailDto.getId) },
      {
        name: userDetailDto.getName,
        birthDate: userDetailDto.getBirthDate,
        gender: userDetailDto.getGender,
        phone: userDetailDto.getPhone,
        address: userDetailDto.getAddress,
      },
    );
  }

  public async updatePwd(id: string, pwd: string): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      { _id: new Types.ObjectId(id) },
      { pwd },
    );
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email: email });
  }

  public async findByAccount(account: string): Promise<IUser | null> {
    return UserModel.findOne({ account: account });
  }

  public async findById(id: string): Promise<IUser | null> {
    return UserModel.findOne({ _id: id });
  }
}
