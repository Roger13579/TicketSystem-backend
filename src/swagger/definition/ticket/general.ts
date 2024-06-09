import { CustomResponseType } from '../../../types/customResponseType';
import { PaginationSuccess } from '../common';
import { TicketStatus } from '../../../types/ticket.type';
import moment from 'moment';

const TicketProductDetail = {
  _id: '66570169343ccb01f586dfed',
  title: '這是個很棒的電影名稱',
  theater: '信義威秀',
  price: 1100,
  startAt: '2024-08-13T16:00:00.000Z',
  recommendWeight: 1,
  isPublic: false,
  photoPath: '',
};

/**
 * @description swagger autogen 可以自動生成，通常用於 response 的 general 資料
 */
export const Ticket = {
  $_id: 'asdfasdfasd',
  $productId: 'cdscsdcsdc',
  $userId: '123235564364567',
  $orderId: 'iiddidididi',
  $status: TicketStatus.unverified,
  $isPublished: false,
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
  $expiredAt: new Date().toISOString(),
  writeOffAt: new Date().toISOString(),
  writeOffStaffId: 'rrr',
  giverId: 'iiddidididi',
};

/**
 * @description swagger autogen fit，取得票券列表的 response
 */
export const GetTicketsSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    tickets: [
      {
        ...Ticket,
        product: TicketProductDetail,
        shareCode: '112315641231',
      },
    ],
    ...PaginationSuccess,
  },
};

export const GetTicketDetailSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $_id: '23h4iuh2iu5hih1ui4hi',
    $userId: 'userIdddisieowofen',
    $orderId: '$orderIdwgefiowehpfuuew',
    $productId: 'productIdoiwjnfpewfuioed',
    $status: TicketStatus.unverified,
    $isPublished: false,
    $title: 'testproduct',
    $photoPath: 'testproduct',
    $theater: 'testproduct',
    $price: 2000,
    $expiredAt: moment().add(2, 'day').add(2, 'hour').toISOString(),
    $startAt: moment().add(2, 'day').add(4, 'hour').toISOString(),
    $purchaseAt: moment().add(2, 'days').toISOString(),
    $purchaseAmount: 11,
  },
};
export const EditTicketsSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    $tickets: [{ ...Ticket, shareCode: '112315641231' }],
  },
};

export const TransferTicketSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    ...Ticket,
    $shareCode: '112315641231',
  },
};
