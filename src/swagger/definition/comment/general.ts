import { CustomResponseType } from '../../../types/customResponseType';

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
      $createdAt: '2024-05-17T10:21:06.901Z',
      $updatedAt: '2024-05-17T10:21:06.901Z',
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
