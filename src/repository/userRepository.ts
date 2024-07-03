import { UserModel } from '../models/user';
import { UserDetailDto } from '../dto/user/userDetailDto';
import { Types } from 'mongoose';
import { GoogleProfileDto } from '../dto/user/googleProfileDto';
import { updateOptions } from '../utils/constants';
import { EditFavoriteDTO } from '../dto/user/editFavoriteDto';
import { GetUserFavoriteDTO } from '../dto/user/getUserFavoriteDto';
import { createGetFavoritePipeline } from '../utils/aggregate/user/getFavorite.pipeline';
import {
  AccountType,
  IGetFavoritePagination,
  ThirdPartyType,
} from '../types/user.type';

export class UserRepository {
  public async createUser(account: string, email: string, pwd: string) {
    return UserModel.create(
      new UserModel({
        email,
        account,
        pwd,
        accountType: AccountType.member,
      }),
    );
  }
  public async createUserByGoogle(googleUser: GoogleProfileDto) {
    return UserModel.create(
      new UserModel({
        account: googleUser.name,
        email: googleUser.email,
        thirdPartyId: googleUser.id,
        thirdPartyType: ThirdPartyType.google,
        avatarPath: googleUser.picture,
        isThirdPartyVerified: true,
        accountType: AccountType.member,
      }),
    );
  }
  public async updateUserFromGoogle(
    account: string,
    pwd: string,
    thirdPartyId: string,
  ) {
    return UserModel.findOneAndUpdate(
      { thirdPartyId: thirdPartyId },
      new UserModel({
        account: account,
        pwd: pwd,
      }),
    );
  }

  public async updateUserDetail(userDetailDto: UserDetailDto) {
    return UserModel.findByIdAndUpdate(
      { _id: new Types.ObjectId(userDetailDto.id) },
      {
        name: userDetailDto.name,
        birthDate: userDetailDto.birthDate,
        gender: userDetailDto.gender,
        phone: userDetailDto.phone,
        address: userDetailDto.address,
        avatarPath: userDetailDto.avatarPath,
      },
      updateOptions,
    );
  }

  public async updatePwd(id: string, pwd: string) {
    return UserModel.findByIdAndUpdate(
      { _id: new Types.ObjectId(id) },
      { pwd },
      updateOptions,
    );
  }

  public async addGroupToUser(id: Types.ObjectId, groupId: Types.ObjectId) {
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
  ) {
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

  public async findByEmail(email: string) {
    return UserModel.findOne({ email: email });
  }

  public async findByAccount(account: string) {
    return UserModel.findOne({ account: account });
  }

  public async findById(id: string) {
    return UserModel.findOne({ _id: id });
  }

  public async findByThirdPartyId(id: string) {
    return UserModel.findOne({ thirdPartyId: id });
  }

  public findFavoriteByUserId = async (
    getUserFavoriteDto: GetUserFavoriteDTO,
  ): Promise<IGetFavoritePagination> => {
    const pipeline = createGetFavoritePipeline(getUserFavoriteDto);
    const results = await UserModel.aggregate(pipeline);
    return results[0];
  };

  public addFavorite = async ({ userId, productId }: EditFavoriteDTO) =>
    await UserModel.findOneAndUpdate(
      {
        _id: userId,
        'favorites.productId': { $ne: productId },
      },
      { $push: { favorites: { productId } } },
      { ...updateOptions, projection: { favorites: 1 } },
    );

  public deleteFavorite = async ({ userId, productId }: EditFavoriteDTO) =>
    await UserModel.findOneAndUpdate(
      {
        _id: userId,
        'favorites.productId': { $eq: productId },
      },
      { $pull: { favorites: { productId } } },
      { ...updateOptions, projection: { favorites: 1 } },
    );
}
