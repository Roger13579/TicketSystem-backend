import { PaymentMethod } from '../../../types/order.type';

export const CustomGetOrderStatusQuery = {
  example: 'paid',
};
export const CustomGetOrderIdQuery = {
  example: 'aaabbb123',
};
export const CustomGetOrderThirdPartyPaymentIdQuery = {
  example: '123123321',
};
export const CustomGetOrderAccountQuery = {
  example: 'roger',
};
export const CustomGetOrderEmailQuery = {
  example: 'email@email',
};
export const CustomGetOrderPhoneQuery = {
  example: '0912345678',
};

const propName = {
  userId: '使用者id',
  items: {
    productId: '商品ID',
    title: '商品名稱',
    amount: '數量',
    price: '價錢',
  },
  price: '訂單總價',
  paymentMethod: '付款方式',
  plan: {
    name: '方案名稱',
    headCount: '方案人數',
    discount: '方案折扣',
  },
  deliveryInfo: {
    name: '姓名',
    phone: '電話',
    address: '地址',
    email: '電子信箱',
  },
};

const customItem = {
  userId: 'aaabbbccc',
  items: {
    productId: 'bbbnnmmmm',
    amount: 5,
  },
  price: 200,
  plan: { name: '雙人行GoGo', headCount: 2, discount: 0.5 },
  paymentMethod: PaymentMethod.linePay,
  deliveryInfo: {
    name: 'Roger',
    phone: '0912345678',
    address: 'aaaa',
    email: 'roger@gmail.com',
  },
};

export const CustomCreateOrderObj = {
  type: 'object',
  required: ['userId', 'items', 'price', 'paymentMethod'],
  properties: {
    userId: {
      type: 'string',
      description: propName.userId,
      example: customItem.userId,
    },
    items: {
      type: 'array',
      description: propName.items,
      items: {
        type: 'object',
        required: ['productId', 'amount'],
        properties: {
          productId: {
            type: 'string',
            description: propName.items.productId,
            example: customItem.items.productId,
          },
          plan: {
            type: 'object',
            required: ['name', 'discount', 'headCount'],
            description: '購買方案，若沒給的話代表購買單人票',
            properties: {
              name: {
                type: 'string',
                description: propName.plan.name,
                example: customItem.plan.name,
              },
              discount: {
                type: 'number',
                description: propName.plan.discount,
                example: customItem.plan.discount,
              },
              headCount: {
                type: 'number',
                description: propName.plan.headCount,
                example: customItem.plan.headCount,
              },
            },
          },
          amount: {
            type: 'number',
            description: propName.items.amount,
            example: customItem.items.amount,
          },
        },
      },
    },
    price: {
      type: 'number',
      description: propName.price,
      example: customItem.price,
    },
    paymentMethod: {
      type: 'string',
      enum: Object.values(PaymentMethod),
      description: propName.paymentMethod,
      example: customItem.paymentMethod,
    },
    deliveryInfo: {
      type: 'object',
      description: '寄貨資訊 (當商品需要寄送實體物體時才需要填寫)',
      properties: {
        name: {
          type: 'string',
          description: propName.deliveryInfo.name,
          example: customItem.deliveryInfo.name,
        },
        phone: {
          type: 'string',
          example: customItem.deliveryInfo.phone,
          description: propName.deliveryInfo.phone,
        },
        address: {
          type: 'string',
          example: customItem.deliveryInfo.address,
          description: propName.deliveryInfo.address,
        },
        email: {
          type: 'string',
          example: customItem.deliveryInfo.email,
          description: propName.deliveryInfo.email,
        },
      },
    },
  },
};
