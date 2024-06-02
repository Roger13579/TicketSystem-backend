import { GetCommentsDTO } from '../dto/comment/getCommentsDto';
import { NewCommentDTO } from '../dto/comment/newCommentDto';
import CommentModel, { IComment } from '../models/comment';
import { EditCommentsDTO } from '../dto/comment/editCommentsDto';
import { FilterQuery, Types } from 'mongoose';
import { updateOptions } from '../utils/constants';

export class CommentRepository {
  public createComment = async ({ comment }: NewCommentDTO) =>
    await CommentModel.create(comment);

  public deleteCommentsById = async (ids: Types.ObjectId[]) => {
    const promises = ids.map((id) => CommentModel.findByIdAndDelete(id));
    const deletedProducts = await Promise.all(promises).then(
      (values) => values,
    );
    return deletedProducts;
  };

  public editComments = async ({ comments }: EditCommentsDTO) => {
    const promises = comments.map(({ id, status }) =>
      CommentModel.findByIdAndUpdate(id, { status }, updateOptions),
    );

    const editComments = await Promise.all(promises).then((values) => values);

    return editComments;
  };

  public deleteComments = async (filter: FilterQuery<IComment>) => {
    return await CommentModel.deleteMany(filter);
  };

  public findComments = async ({
    filter,
    sort,
    accounts,
    productNameRegex,
    page,
    limit,
    projection,
  }: GetCommentsDTO) => {
    const productNameFilter = productNameRegex
      ? {
          'product.title': { $regex: productNameRegex },
        }
      : undefined;
    const accountsFilter = accounts
      ? {
          'user.account': { $in: accounts },
        }
      : undefined;
    return await CommentModel.aggregate([
      {
        $lookup: {
          localField: 'productId',
          from: 'products',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $lookup: {
          localField: 'userId',
          from: 'users',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$product' },
      { $unwind: '$user' },
      {
        $match: {
          ...filter,
          ...(productNameRegex && productNameFilter),
          ...(accounts && accountsFilter),
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          comments: [
            { $sort: sort },
            { $skip: (page - 1) * limit },
            {
              $limit: limit,
            },
            { $project: projection },
          ],
        },
      },
    ]);
  };
}
