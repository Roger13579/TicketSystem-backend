import { GetCommentsDTO } from '../dto/comment/getCommentsDto';
import { NewCommentDTO } from '../dto/comment/newCommentDto';
import CommentModel, { IComment } from '../models/comment';
import { EditCommentsDTO } from '../dto/comment/editCommentsDto';
import { FilterQuery, Types } from 'mongoose';
import { updateOptions } from '../utils/constants';
import { createGetCommentPipeline } from '../utils/aggregate/comment/getComment.pipeline';
import { IEditComment, IGetCommentsPagination } from '../types/comment.type';

export class CommentRepository {
  public createComment = async ({ comment }: NewCommentDTO) =>
    await CommentModel.create(comment);

  public deleteCommentsById = async (ids: Types.ObjectId[]) => {
    const promises = ids.map((id) => CommentModel.findByIdAndDelete(id));
    return await Promise.all(promises).then((values) => values);
  };

  public deleteById = async (id: Types.ObjectId) =>
    await CommentModel.findByIdAndDelete(id);

  public updateComments = async ({ comments }: EditCommentsDTO) => {
    const promises = comments.map(({ id, status }) =>
      CommentModel.findByIdAndUpdate(id, { status }, updateOptions),
    );

    return await Promise.all(promises).then((values) => values);
  };

  public updateById = async ({ id, status }: IEditComment) =>
    await CommentModel.findByIdAndUpdate(id, { status }, updateOptions);

  public deleteComments = async (filter: FilterQuery<IComment>) =>
    await CommentModel.deleteMany(filter);

  public findComments: (
    getCommentsDto: GetCommentsDTO,
  ) => Promise<IGetCommentsPagination> = async (getCommentsDto) => {
    const pipeline = createGetCommentPipeline(getCommentsDto);
    const results = await CommentModel.aggregate(pipeline);
    return results[0];
  };
}
