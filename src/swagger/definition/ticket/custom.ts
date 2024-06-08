import moment from 'moment';
import { TicketStatus } from '../../../types/ticket.type';
import { validEditStatus } from '../../../utils/ticket.constants';

export const CustomGetTicketIsPublished = {
  example: false,
};
export const CustomGetTicketProductName = {
  example: '電影名稱',
};
export const CustomGetTicketIdQuery = {
  example: '123123321',
};
export const CustomGetTicketStatusQuery = {
  example: TicketStatus.verified,
};

const propName = {
  productId: '商品 id',
  userId: '擁有者 id',
  ticketId: '票券 id',
  amount: '票券數量',
  status: '票券狀態',
  isPublished: '票券是否上架',
  expiredAt: '票券過期時間',
};

const ticket = {
  productId: '665b00748f529f5f17923acd',
  userId: '665b00748f529f5f17923acd',
  ticketId: '665b00748f529f5f17923acd',
  amount: 2,
  status: TicketStatus.unverified,
  isPublished: true,
  expiredAt: moment().toDate(),
};

const property = {
  productId: {
    type: 'string',
    description: propName.productId,
    example: ticket.productId,
  },
  userId: {
    type: 'string',
    description: propName.userId,
    example: ticket.userId,
  },
  ticketId: {
    type: 'string',
    description: propName.ticketId,
    example: ticket.ticketId,
  },
  amount: {
    type: 'number',
    description: propName.amount + '如果是多人套票，該值就會大於 1',
    example: ticket.amount,
  },
  status: {
    type: 'string',
    enum: validEditStatus,
    description: propName.status,
    example: ticket.status,
  },
  isPublished: {
    type: 'boolean',
    description: propName.isPublished,
    example: ticket.isPublished,
  },
  expiredAt: {
    type: 'date',
    description:
      propName.expiredAt +
      '如果要調整到已過期的狀態，需要先編輯 expiredAt 再去改 status',
    example: ticket.expiredAt,
  },
};

export const CustomVerifyTicketsObj = {
  type: 'object',
  required: ['tickets'],
  properties: {
    tickets: {
      type: 'array',
      items: {
        type: 'object',
        required: ['ticketId', 'userId', 'productId', 'amount'],
        properties: {
          productId: property.productId,
          userId: property.userId,
          ticketId: property.ticketId,
          amount: property.amount,
        },
      },
    },
  },
};

export const CustomEditTicketsObj = {
  type: 'object',
  required: ['tickets'],
  properties: {
    tickets: {
      type: 'array',
      items: {
        type: 'object',
        required: ['ticketId'],
        properties: {
          ticketId: property.ticketId,
          status: property.status,
          isPublished: property.isPublished,
          expiredAt: property.expiredAt,
        },
      },
    },
  },
};
