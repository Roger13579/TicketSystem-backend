import { TicketStatus } from '../../../types/ticket.type';

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
};

const ticket = {
  productId: '665b00748f529f5f17923acd',
  userId: '665b00748f529f5f17923acd',
  ticketId: '665b00748f529f5f17923acd',
  amount: 2,
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
        },
      },
    },
  },
};
