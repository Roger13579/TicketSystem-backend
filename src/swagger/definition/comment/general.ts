import moment from 'moment';
import { CustomResponseType } from '../../../types/customResponseType';
import { PaginationSuccess } from '../common';

const Comment = {
  $_id: '665b0ac317dba1ca40af0c6a',
  $rating: 5,
  $content: '宇宙讚讚 A',
  $status: 'disabled',
  $createdAt: moment().toDate(),
  $updatedAt: moment().toDate(),
};

export const CreateCommentSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $comment: {
      ...Comment,
      $productId: '664637559f1b5efbad4c8b16',
      $userId: '66423369996f95232548cb91',
    },
  },
};

export const DeleteSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $deletedCount: 1,
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

export const EditCommentsObj = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $comments: [
      {
        ...Comment,
        $productId: '665b00748f529f5f17923acd',
        $user: '6656fdfaea3c0ab9e916788e',
      },
    ],
  },
};
