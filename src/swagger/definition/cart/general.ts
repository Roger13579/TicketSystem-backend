import { CustomResponseType } from '../../../types/customResponseType';
import { MovieGenre, ProductType } from '../../../types/product.type';
import { PaginationSuccess } from '../common';
import { EditCartType } from '../../../types/cart.type';

export const defaultItem = {
  $amount: 10,
  $_id: '665323ce2cff52b99ea393c8',
};

const defaultCart = {
  $_id: '665b553acbea41c4b7a8dcdf',
  $userId: '6656fdfaea3c0ab9e916788e',
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
};

const detailItem = {
  $product: {
    $_id: defaultItem.$_id,
    title: '這是個很棒的電影名稱喔',
    type: ProductType.preScreeningMeeting,
    genre: MovieGenre.action,
    price: 1100,
    soldAmount: 0,
    amount: 100,
    isLaunched: true,
    photoPath: 'https://images.unsplash.com/abc',
    sellStartAt: new Date().toISOString(),
    sellEndAt: new Date().toISOString(),
  },
  plan: {
    $name: '兩人同行',
    $discount: 0.8,
    $headCount: 2,
  },
  $amount: defaultItem.$amount,
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

const editItem = {
  $amount: defaultItem.$amount,
  $createdAt: defaultCart.$createdAt,
  $updatedAt: defaultCart.$updatedAt,
  $productId: defaultItem.$_id,
};

const subInfo = {
  $subStatus: CustomResponseType.INVALID_DELETE_CART,
  $subMessage: CustomResponseType.INVALID_DELETE_CART_MESSAGE + '刪除失敗',
};

export const EditCartSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $errors: [
      {
        $item: {
          $type: EditCartType.inc,
          $productId: defaultItem.$_id,
          $amount: defaultItem.$amount,
        },
        ...subInfo,
      },
    ],
    $items: [editItem],
  },
};

export const DeleteCartSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $errors: [
      {
        $item: { $productId: defaultItem.$_id },
        ...subInfo,
      },
    ],
    $items: [editItem],
  },
};
