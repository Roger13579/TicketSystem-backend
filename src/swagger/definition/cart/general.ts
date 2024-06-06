import moment from 'moment';
import { CustomResponseType } from '../../../types/customResponseType';
import { MovieGenre, ProductType } from '../../../types/product.type';
import { PaginationSuccess } from '../common';

export const defaultItem = {
  $amount: 2200,
  $_id: '665323ce2cff52b99ea393c8',
};

export const optionalItem = {
  $product: defaultItem.$_id,
  $detailProduct: {
    $_id: defaultItem.$_id,
    $title: '商品CD',
    $type: ProductType.premier,
    $genre: MovieGenre.action,
    $price: 1100,
    $amount: defaultItem.$amount,
    $soldAmount: 0,
    $sellStartAt: moment().toDate(),
    $sellEndAt: moment().toDate(),
    $isLaunched: true,
    $photoPath: '',
  },
};

const defaultCart = {
  $_id: '665b553acbea41c4b7a8dcdf',
  $userId: '6656fdfaea3c0ab9e916788e',
  $createdAt: '2024-06-01T17:07:06.055Z',
  $updatedAt: '2024-06-05T15:20:06.616Z',
};

const detailItem = {
  $product: {
    $_id: '665b00748f529f5f17923acd',
    title: '這是個很棒的電影名稱喔',
    type: ProductType.preScreeningMeeting,
    genre: MovieGenre.action,
    price: 1100,
    soldAmount: 0,
    amount: 100,
    isLaunched: true,
    photoPath: 'https://images.unsplash.com/abc',
    sellStartAt: moment().toDate(),
    sellEndAt: moment().toDate(),
  },
  $amount: 7,
};

export const GetCartSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    ...PaginationSuccess,
    ...defaultCart,
    $items: [detailItem],
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
          $amount: detailItem.$amount,
          $product: detailItem.$product.$_id,
        },
      ],
    },
  },
};
