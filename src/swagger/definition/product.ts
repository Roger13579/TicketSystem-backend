import moment from 'moment';
import { CustomResponseType } from '../../types/customResponseType';
import { ProductType, MovieGenre } from '../../types/product.type';

const CustomPlan = {
  name: '三人同行好棒棒',
  discount: 0.5,
  headCount: 10,
};

const CustomProduct = {
  $title: 'string',
  $type: ProductType.premier,
  $genre: MovieGenre.action,
  $vendor: '貓咪影業',
  $theater: '信義威秀',
  $price: 1100,
  $amount: 100,
  $soldAmount: 0,
  plans: [CustomPlan],
  $introduction: '<p>很棒的商品</p>',
  $isLaunched: false,
  $isPublic: false,
  $recommendWeight: 1,
  $sellEndAt: moment().add(2, 'day').add(2, 'hour').toISOString(),
  $sellStartAt: moment().add(2, 'days').toISOString(),
  $endAt: moment().add(2, 'day').add(6, 'hour').toISOString(),
  $startAt: moment().add(2, 'day').add(4, 'hour').toISOString(),
  tags: ['A', 'B'],
  photoPath: '',
  notifications: ['通知一', '通知二'],
  highlights: ['亮點一', '亮點二'],
  cautions: ['事項一', '事項二'],
  confirmations: ['確認詳情一', '確認詳情二'],
  cancelPolicies: ['取消政策一', '取消政策二'],
  certificates: ['憑證類型一', '憑證類型二'],
};

export const CreateProductsSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    products: [CustomProduct],
  },
};

export const CustomCreateProductsObj = {
  type: 'object',
  required: ['products'],
  properties: {
    products: {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'title',
          'type',
          'genre',
          'vendor',
          'theater',
          'price',
          'amount',
          'soldAmount',
          'startAt',
          'endAt',
          'sellStartAt',
          'sellEndAt',
          'recommendWeight',
          'isPublic',
          'isLaunched',
          'introduction',
        ],
        properties: {
          title: {
            type: 'string',
            example: CustomProduct.$title,
            description: '商品名稱',
          },
          type: {
            type: 'string',
            example: CustomProduct.$type,
            enum: Object.values(ProductType),
            description: '商品類別',
          },
          genre: {
            type: 'string',
            example: CustomProduct.$genre,
            enum: Object.values(MovieGenre),
            description: '電影分類',
          },
          vendor: {
            type: 'string',
            example: CustomProduct.$vendor,
            description: '供應商',
          },
          theater: {
            type: 'string',
            example: CustomProduct.$theater,
            description: '位置',
          },
          price: {
            type: 'number',
            example: CustomProduct.$price,
            min: 100,
            description: '單買一張的票價',
          },
          amount: {
            type: 'number',
            example: CustomProduct.$amount,
            min: 0,
            description: '票券總量，不得低於最大人數方案。',
          },
          soldAmount: {
            type: 'number',
            example: CustomProduct.$soldAmount,
            min: 0,
            description: '已銷售數量',
          },
          plans: {
            type: 'array',
            items: {
              type: 'object',
              required: ['name', 'discount', 'headCount'],
              properties: {
                name: {
                  type: 'string',
                  description: '方案名稱',
                  example: CustomPlan.name,
                  min: 2,
                },
                discount: {
                  type: 'number',
                  max: 1,
                  min: 0.1,
                  example: CustomPlan.discount,
                  description: '方案折扣數',
                },
                headCount: {
                  type: 'number',
                  min: 0,
                  example: CustomPlan.headCount,
                  description: '方案包含人數',
                },
              },
            },
          },
          introduction: {
            type: 'string',
            example: CustomProduct.$introduction,
            description: '商品介紹 (html)',
          },
          isLaunched: {
            type: 'boolean',
            example: CustomProduct.$isLaunched,
            description: '是否開始販賣，尚未公開的情況下，商品不可以進行販賣',
          },
          isPublic: {
            type: 'boolean',
            example: CustomProduct.$isPublic,
            description: '是否公開',
          },
          recommendWeight: {
            type: 'number',
            min: 1,
            max: 10,
            example: CreateProductsSuccess.$data.products[0].$recommendWeight,
            description: '推薦權重',
          },
          sellEndAt: {
            type: 'Date',
            example: CustomProduct.$sellEndAt,
            min: moment().add(1, 'day').add(1, 'hour'),
            description: '販賣結束時間，必須晚於販賣開始時間至少一個小時',
          },
          sellStartAt: {
            type: 'Date',
            example: CustomProduct.$sellStartAt,
            min: moment().add(1, 'day'),
            description: '販賣開始時間，必須晚於現在時間至少一天',
          },
          endAt: {
            type: 'Date',
            example: CustomProduct.$endAt,
            min: moment().add(1, 'day').add(3, 'hour'),
            description: '活動結束時間，必須晚於活動開始時間至少一個小時',
          },
          startAt: {
            type: 'Date',
            example: CustomProduct.$startAt,
            min: moment().add(1, 'day').add(2, 'hour'),
            description: '活動開始時間，必須晚於販售結束時間至少一個小時',
          },
          tags: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                tagId: {
                  type: 'string',
                  example: 'AAA',
                  description: '標籤',
                },
              },
            },
          },
          photoPath: {
            type: 'string',
            description: '商品圖片 Url',
            example: CustomProduct.photoPath,
          },
          notifications: {
            type: 'array',
            description: '通知列表',
            example: CustomProduct.notifications,
            items: {
              type: 'string',
            },
          },
          highlights: {
            type: 'array',
            description: '活動亮點列表',
            example: CustomProduct.highlights,
            items: {
              type: 'string',
            },
          },
          cautions: {
            type: 'array',
            description: '注意事項列表',
            example: CustomProduct.cautions,
            items: {
              type: 'string',
            },
          },
          confirmations: {
            type: 'array',
            description: '確認詳情列表',
            example: CustomProduct.confirmations,
            items: {
              type: 'string',
            },
          },
          cancelPolicies: {
            type: 'array',
            description: '取消政策列表',
            example: CustomProduct.cancelPolicies,
            items: {
              type: 'string',
            },
          },
          certificates: {
            type: 'array',
            description: '憑證類型列表',
            example: CustomProduct.certificates,
            items: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
