import { CustomResponseType } from '../../../types/customResponseType';

/**
 * @description swagger autogen 可以自動生成，通常用於 response 的 general 資料
 */
export const OrderItem = {
  $_id: 'asdfasdfasd',
  thirdPartyPaymentId: 'cdscsdcsdc',
  user: {
    account: 'roger',
    name: 'rrroger',
    phone: '0912345678',
    email: 'roger@gmail.com',
  },
  orders: [
    {
      title: '我是商品名稱',
      brief: '我是商品簡稱',
      type: 'premier',
      genre: 'Action',
      vendor: 'ABC',
      theater: '威秀',
      price: 300,
    },
  ],
  paymentMethod: 'linepay',
  price: 300,
  status: 'paid',
  createdAt: '2024-05-19 12:00:00',
  paidAt: '2024-05-19 12:00:02',
};

/**
 * @description swagger autogen fit，取得訂單列表的 response
 */
export const GetOrdersSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $orders: [OrderItem],
    $page: 1,
    $limit: 10,
    $totalCount: 5,
  },
};

export const CreateOrdersSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $merchantId: 'ABCD1234',
    $tradeSha: '1231u2h3uli1hi2h3h1uh2uli3h',
    $tradeInfo: 'jiijwfsijofpdqwpokdqwkopdwqodpkqwdqwop',
    $version: '2.0',
    $paymentGateway: 'https://ccc.ccc.ccc',
  },
};
