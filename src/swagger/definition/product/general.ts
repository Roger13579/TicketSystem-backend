import moment from 'moment';
import { MovieGenre, ProductType } from '../../../types/product.type';
import { CustomResponseType } from '../../../types/customResponseType';

/**
 * @description swagger autogen fit 的商品方案
 */
export const PlanItem = {
  $name: '三人同行好棒棒',
  $discount: 0.5,
  $headCount: 10,
};

/**
 * @description swagger autogen 可自動生成的形式，通常用於 response 的 detail 資料
 */
export const ProductDetailItem = {
  plans: [PlanItem],
  tags: [],
  $introduction: '<p>很棒的商品</p>',
  notifications: ['通知一', '通知二'],
  highlights: ['亮點一', '亮點二'],
  cautions: ['事項一', '事項二'],
  confirmations: ['確認詳情一', '確認詳情二'],
  cancelPolicies: ['取消政策一', '取消政策二'],
  certificates: ['憑證類型一', '憑證類型二'],
};

/**
 * @description swagger autogen 可以自動生成，通常用於 response 的 general 資料
 */
export const ProductItem = {
  $_id: 'asdfasdfasd',
  $title: '這是一個商品名稱',
  $type: ProductType.premier,
  $genre: MovieGenre.action,
  $theater: '信義威秀',
  $brief: '簡短的介紹介紹',
  vendor: '貓咪影業',
  price: 1100,
  amount: 100,
  soldAmount: 0,
  isLaunched: false,
  isPublic: false,
  recommendWeight: 1,
  sellEndAt: moment().add(2, 'day').add(2, 'hour').toISOString(),
  sellStartAt: moment().add(2, 'days').toISOString(),
  endAt: moment().add(2, 'day').add(6, 'hour').toISOString(),
  startAt: moment().add(2, 'day').add(4, 'hour').toISOString(),
  tags: [{ tagId: '123' }, { tagId: '123' }],
  photoPath: '',
};

/**
 * @description swagger autogen fit，批次新增商品列表的 response
 */
export const CreateProductsSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $products: [{ ...ProductItem, ...ProductDetailItem }],
  },
};

/**
 * @description swagger autogen fit，取得商品詳細資料的 response
 */
export const GetProductDetailSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $product: {
      $_id: 'asdfasdfasd',
      $title: '這是一個商品名稱',
      $type: ProductType.premier,
      $genre: MovieGenre.action,
      $theater: '信義威秀',
      $price: 1100,
      $amount: 100,
      $soldAmount: 0,
      $isLaunched: false,
      $sellEndAt: moment().add(2, 'day').add(2, 'hour').toISOString(),
      $sellStartAt: moment().add(2, 'days').toISOString(),
      $endAt: moment().add(2, 'day').add(6, 'hour').toISOString(),
      $startAt: moment().add(2, 'day').add(4, 'hour').toISOString(),
      $tags: [{ tagId: '123' }, { tagId: '123' }],
      $photoPath: '',
      ...ProductDetailItem,
    },
  },
};

/**
 * @description swagger autogen fit，取得商品列表的 response
 */
export const GetProductsSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $products: [ProductItem],
    $page: 1,
    $limit: 10,
    $totalCount: 1,
  },
};

export const EditProductsSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $products: [{ ...ProductItem, ...ProductDetailItem }],
  },
};
