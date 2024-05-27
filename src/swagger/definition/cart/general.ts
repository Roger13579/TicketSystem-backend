import { CustomResponseType } from '../../../types/customResponseType';

export const defaultItem = {
  $amount: 2200,
  $_id: '665323ce2cff52b99ea393c8',
  $createdAt: '2024-05-26T11:58:06.698Z',
  $updatedAt: '2024-05-26T11:58:11.664Z',
};

export const optionalItem = {
  $product: '66531dafaa305144ec3732a5',
  $detailProduct: {
    $_id: '66531dafaa305144ec3732a5',
    $title: '商品CD',
    $type: 'premier',
    $genre: 'action',
    $price: 1100,
    $amount: 100,
    $soldAmount: 0,
    $sellStartAt: '2024-06-13T16:00:00.000Z',
    $sellEndAt: '2024-07-13T16:00:00.000Z',
    $isPublic: true,
    $isLaunched: true,
    $photoPath: '',
  },
};

export const defaultCart = {
  $_id: '6653237c397ee87231916356',
  $userId: '66423369996f95232548cb91',
  $createdAt: '2024-05-26T11:56:44.363Z',
  $updatedAt: '2024-05-26T12:50:08.927Z',
};

export const GetCartSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $cart: {
      ...defaultCart,
      $items: [
        {
          ...defaultItem,
          $product: optionalItem.$detailProduct,
        },
      ],
    },
  },
};

export const EditCartSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $cart: {
      ...defaultCart,
      $items: [
        {
          ...defaultItem,
          $product: optionalItem.$product,
        },
      ],
    },
  },
};
