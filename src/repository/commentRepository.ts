import { FilterQuery, Types } from 'mongoose';
import { GetCommentsDTO } from '../dto/comment/getCommentsDto';
import { NewCommentDTO } from '../dto/comment/newCommentDto';
import CommentModel, { IComment } from '../models/comment';
import ProductModel from '../models/product';

export class CommentRepository {
  public createComment = async ({ comment }: NewCommentDTO) =>
    await CommentModel.create(comment);

  public deleteComments = async (filter: FilterQuery<IComment>) => {
    return await CommentModel.deleteMany(filter);
  };

  public findComments = async ({
    filter,
    options,
    productName,
  }: GetCommentsDTO) => {
    const productIds: Types.ObjectId[] = [];
    if (!!productName) {
      // 商品名稱的模糊搜尋
      const titleRegex = new RegExp(productName);
      const ids: Types.ObjectId[] = await ProductModel.find({
        title: { $regex: titleRegex },
      })
        .select('_id')
        .exec()
        .then((list) => list.map((item) => item._id));
      productIds.push(...ids);
    }

    return await CommentModel.paginate(
      {
        ...filter,
        ...(productIds.length > 0 && { productId: { $in: productIds } }),
      },
      options,
    );
  };
}
