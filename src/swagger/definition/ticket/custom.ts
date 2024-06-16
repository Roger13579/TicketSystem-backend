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
export const CustomRefundTicketsReason = {
  example: 'test reason',
};

const propName = {
  productId: '商品 id',
  userId: '擁有者 id',
  ticketId: '票券 id',
  status: '票券狀態',
  isPublished: '票券是否上架',
  expiredAt: '票券過期時間',
  shareCode: '分票驗證碼',
};

const ticket = {
  productId: '665b00748f529f5f17923acd',
  userId: '665b00748f529f5f17923acd',
  ticketId: '665b00748f529f5f17923acd',
  status: TicketStatus.unverified,
  isPublished: true,
  expiredAt: new Date().toISOString(),
  shareCode:
    'nyKsMFxIGHx1KQDPwihn8g==:NetZ7IrEnMEVDqgStoAvsBTBw0dpQYg8ElXK94+uMoc=',
};

const property = {
  productId: {
    type: 'string',
    description: propName.productId,
    example: ticket.productId,
  },
  shareCode: {
    type: 'string',
    description: propName.shareCode,
    example: ticket.shareCode,
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
        required: ['ticketId', 'userId', 'productId'],
        properties: {
          productId: property.productId,
          userId: property.userId,
          ticketId: property.ticketId,
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

export const CustomCreateShareCodeObj = {
  type: 'object',
  required: ['ticketId'],
  properties: {
    ticketId: property.ticketId,
  },
};

export const CustomClaimTicketObj = {
  type: 'object',
  required: ['shareCode'],
  properties: {
    shareCode: property.shareCode,
  },
};

export const CustomDeleteTicketsObj = {
  type: 'object',
  required: ['ticketIds'],
  properties: {
    ticketIds: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};
