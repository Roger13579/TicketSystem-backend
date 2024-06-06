import { UserModel, IUser } from '../models/user';
import { UserDetailDto } from '../dto/user/userDetailDto';
import { Types } from 'mongoose';
import { GoogleProfileDto } from '../dto/user/googleProfileDto';
import { updateOptions } from '../utils/constants';
import { EditFavoriteDTO } from '../dto/user/editFavoriteDto';
import { GetUserFavoriteDTO } from '../dto/user/getUserFavoriteDto';
import { createGetFavoritePipeline } from '../utils/aggregate/user/getFavorite.pipeline';

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
  public async createUserByGoogle(
    googleUser: GoogleProfileDto,
  ): Promise<IUser> {
    return UserModel.create(
      new UserModel({
        account: googleUser.getEmail,
        email: googleUser.getEmail,
        thirdPartyId: googleUser.getId,
        thirdPartyType: 'google',
        avatarPath: googleUser.getPicture,
        isThirdPartyVerified: googleUser.getEmailVerified,
        accountType: 'member',
      }),
    );
  }
  public async updateUserFromGoogle(
    account: string,
    pwd: string,
    thirdPartyId: string,
  ): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { thirdPartyId: thirdPartyId },
      new UserModel({
        account: account,
        pwd: pwd,
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
      updateOptions,
    );
  }

  public async updatePwd(id: string, pwd: string): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      { _id: new Types.ObjectId(id) },
      { pwd },
      updateOptions,
    );
  }

  public async addGroupToUser(
    id: Types.ObjectId,
    groupId: Types.ObjectId,
  ): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          groups: { groupId: groupId },
        },
      },
      updateOptions,
    );
  }
  public async removeGroupFromUser(
    id: Types.ObjectId,
    groupId: Types.ObjectId,
  ): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      { _id: id },
      {
        $pull: {
          groups: { groupId: groupId },
        },
      },
      updateOptions,
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

  public async findByThirdPartyId(id: string): Promise<IUser | null> {
    return UserModel.findOne({ thirdPartyId: id });
  }

  public findFavoriteByUserId = async (
    getUserFavoriteDto: GetUserFavoriteDTO,
  ) => {
    const pipeline = createGetFavoritePipeline(getUserFavoriteDto);
    const results = await UserModel.aggregate(pipeline);
    return results[0];
  };

  public addFavorite = async ({ userId, productId }: EditFavoriteDTO) => {
    return await UserModel.findOneAndUpdate(
      {
        _id: userId,
        'favorites.productId': { $ne: productId },
      },
      { $push: { favorites: { productId } } },
      { ...updateOptions, projection: { favorites: 1 } },
    );
  };

  public deleteFavorite = async ({ userId, productId }: EditFavoriteDTO) => {
    return await UserModel.findOneAndUpdate(
      {
        _id: userId,
        'favorites.productId': { $eq: productId },
      },
      { $pull: { favorites: { productId } } },
      { ...updateOptions, projection: { favorites: 1 } },
    );
  };
}
