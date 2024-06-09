import { CustomResponseType } from '../../../types/customResponseType';
import { PaginationSuccess } from '../common';
import { Status } from '../../../types/common.type';

const Comment = {
  $_id: '665b0ac317dba1ca40af0c6a',
  $rating: 5,
  $content: '宇宙讚讚 A',
  $status: Status.disabled,
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
};

export const CreateCommentSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    ...Comment,
    $productId: '664637559f1b5efbad4c8b16',
    $userId: '66423369996f95232548cb91',
  },
};

export const GetCommentsSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $comments: [
      {
        ...Comment,
        $user: {
          $account: 'yjadmin0001',
          $avatarPath: '',
        },
      },
    ],
    ...PaginationSuccess,
  },
};

const editComment = {
  ...Comment,
  $productId: '665b00748f529f5f17923acd',
  $user: '6656fdfaea3c0ab9e916788e',
};

export const EditCommentsSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $errors: [
      {
        $comment: {
          $id: Comment.$_id,
          $status: Comment.$status,
        },
        subStatus: CustomResponseType.EDIT_COMMENT_ERROR,
        subMessage: CustomResponseType.EDIT_COMMENT_ERROR_MESSAGE,
      },
    ],
    $comments: [editComment],
  },
};

export const DeleteCommentsSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $comments: [editComment],
    $errors: [
      {
        $comment: { $commentId: Comment.$_id },
        subStatus: CustomResponseType.INVALID_DELETE_COMMENT,
        subMessage: CustomResponseType.INVALID_DELETE_COMMENT_MESSAGE,
      },
    ],
  },
};
