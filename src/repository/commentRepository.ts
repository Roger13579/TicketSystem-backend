import { NewCommentDTO } from '../dto/newCommentDto';
import CommentModel from '../models/comment';

export class CommentRepository {
  public createComment = async (newCommentDto: NewCommentDTO) => {
    const { comment } = newCommentDto;
    return await CommentModel.create(comment);
  };
}
