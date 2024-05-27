import { FilterQuery } from 'mongoose';
import { GetCommentsDTO } from '../dto/comment/getCommentsDto';
import { NewCommentDTO } from '../dto/comment/newCommentDto';
import { ModelName } from '../models/baseModel';
import CommentModel, { IComment } from '../models/comment';
import { collectionName } from '../utils/common';

export class CommentRepository {
  private createFilter = (getCommentsDto: GetCommentsDTO) => {
    const {
      productIds,
      status,
      ratings,
      createdAtFrom,
      createdAtTo,
      accounts,
      content,
      // productName, // TODO: 後台使用
    } = getCommentsDto;

    const contentRegex = content ? new RegExp(content) : undefined;
    return {
      ...(!!productIds && { productId: { $in: productIds } }),
      ...(status && { status }),
      ...(!!ratings && { rating: { $in: ratings } }),
      ...(contentRegex && { content: { $regex: contentRegex } }),
      ...(!!accounts && { account: { $in: accounts } }),
      ...((createdAtFrom || createdAtTo) && {
        createdAt: {
          ...(createdAtFrom && { $lte: createdAtFrom }),
          ...(createdAtTo && { $gte: createdAtTo }),
        },
      }),
    };
  };

  public createComment = async (newCommentDto: NewCommentDTO) => {
    const { comment } = newCommentDto;
    return await CommentModel.create(comment);
  };

  public deleteComments = async (filter: FilterQuery<IComment>) => {
    return await CommentModel.deleteMany(filter);
  };

  public findComments = async (getCommentsDto: GetCommentsDTO) => {
    const { page, limit, sortBy } = getCommentsDto;

    const filter = this.createFilter(getCommentsDto);

    return await CommentModel.aggregate([
      { $match: filter },
      {
        $sort: {
          [`${sortBy ? sortBy.replace('-', '') : 'createdAt'}`]:
            sortBy?.includes('-') ? -1 : 1,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: collectionName(ModelName.user),
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      // {
      //   $lookup: {
      //     from: collectionName(ModelName.product),
      //     localField: 'productId',
      //     foreignField: '_id',
      //     as: 'product',
      //   },
      // },// 未來有需要商品資訊的時候再加
      {
        $project: {
          _id: 1,
          rating: 1,
          content: 1,
          createdAt: 1,
          user: {
            account: '$user.account',
            avatarPath: '$user.avatarPath',
            name: '$user.name',
          },
          // product: 1, // 未來有需要商品資訊的時候再加
        },
      },
    ]);
  };

  public countComments = async (getCommentsDto: GetCommentsDTO) => {
    const filter = this.createFilter(getCommentsDto);
    return await CommentModel.countDocuments(filter);
  };
}
