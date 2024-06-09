
import { CustomResponseType } from '../../../types/customResponseType';
import { PaginationSuccess } from '../common';

const favorite = {
  product: {
    $_id: '665b00748f529f5f17923acd',
    title: '這是個很棒的電影名稱喔',
    type: 'premier',
    genre: 'action',
    price: 1100,
    soldAmount: 0,
    amount: 100,
    isLaunched: true,
    photoPath: 'https://images.unsplash.com/photo-1554080353-a576cf803bda',
    sellStartAt: new Date().toISOString(),
    sellEndAt: new Date().toISOString(),
  },
};

export const GetFavoriteSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    ...PaginationSuccess,
    $favorites: [favorite],
  },
};

export const EditFavoriteSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $favorites: [
      {
        $productId: favorite.product.$_id,
      },
    ],
  },
};
