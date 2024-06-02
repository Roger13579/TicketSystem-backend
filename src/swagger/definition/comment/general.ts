import moment from 'moment';
import { CustomResponseType } from '../../../types/customResponseType';
import { PaginationSuccess } from '../common';

export const CreateCommentSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $comment: {
      $productId: '664637559f1b5efbad4c8b16',
      $userId: '66423369996f95232548cb91',
      $rating: 5,
      $content: '宇宙讚讚',
      $status: 'active',
      $_id: '66472f92c993e6a6a3c38ecc',
      $createdAt: moment().toDate(),
      $updatedAt: moment().toDate(),
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
        $_id: '664760bfb43426ed855d1b2c',
        $rating: 5,
        $content: '宇宙讚讚 A',
        $createdAt: moment().toDate(),
        $user: {
          $account: 'yjadmin0001',
          $avatarPath: '',
        },
      },
    ],
    ...PaginationSuccess,
  },
};
