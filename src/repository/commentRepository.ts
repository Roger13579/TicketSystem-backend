import { GetCommentsDTO } from '../dto/comment/getCommentsDto';
import { NewCommentDTO } from '../dto/comment/newCommentDto';
import CommentModel, { IComment } from '../models/comment';
import { EditCommentsDTO } from '../dto/comment/editCommentsDto';
import { FilterQuery, Types } from 'mongoose';
import { updateOptions } from '../utils/constants';
import { createGetCommentPipeline } from '../utils/aggregate/comment/getComment.pipeline';

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

  public findComments = async (getCommentsDto: GetCommentsDTO) => {
    const pipeline = createGetCommentPipeline(getCommentsDto);
    const results = await CommentModel.aggregate(pipeline);
    return results[0];
  };
}
