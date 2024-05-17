import { Schema, model } from 'mongoose';
import { MovieGenre, ProductType, TPlan } from '../types/product.type';
import { schemaOption } from '../utils/constants';
import moment from 'moment';
import { BaseModel, schemaDef } from './baseModel';

export interface IProduct extends BaseModel {
  title: string;
  type: ProductType;
  genre: MovieGenre;
  vendor: string;
  theater: string;
  price: number;
  amount: number; // 票券總量
  plans?: TPlan[];
  startAt: Date;
  endAt: Date;
  sellStartAt: Date;
  sellEndAt: Date;
  recommendWeight: number;
  isPublic: boolean;
  isLaunched: boolean;
  tags?: [{ tagId: Schema.Types.ObjectId }];
  photoPath: string;
  notifications?: [string];
  highlights?: [string];
  introduction?: string;
  cautions?: [string];
  confirmations?: [string];
  cancelPolicies?: [string];
  certificates?: [string];
  comments?: [{ commentId: Schema.Types.ObjectId }];
  soldAmount: number;
  brief: string;
}

const { commentId, tagId, photoPath } = schemaDef;

const schema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    brief: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(ProductType),
      required: true,
    },
    genre: {
      type: String,
      enum: Object.values(MovieGenre),
      required: true,
    },
    vendor: {
      type: String,
      required: true,
      trim: true,
    },
    theater: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 100,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, '數量不得為 0'],
      validate: {
        validator: function (amount: number) {
          // TODO: 找到正確的 access 方式，不要 as unknown as IProduct
          const { plans } = this as unknown as IProduct;
          return !!plans
            ? amount > Math.max(...plans.map(({ headCount }) => headCount))
            : true;
        },
        message: '總數量錯誤，請確認 plans 內部數量',
      },
    },
    soldAmount: {
      type: Number,
      default: 0,
    },
    plans: {
      type: [
        {
          name: String,
          discount: {
            type: Number,
            max: 1,
            min: 0.1,
          },
          headCount: {
            type: Number,
            min: 2,
          },
        },
      ],
    },
    startAt: {
      type: Date,
      required: true,
      validate: {
        validator: function (startAt: Date) {
          const { sellEndAt } = this as unknown as IProduct;
          return moment(startAt).isAfter(sellEndAt, 'hour');
        },
        message: '活動開始時間必須晚於販售結束時間至少一個小時',
      },
    },
    endAt: {
      type: Date,
      required: true,
      validate: {
        validator: function (endAt: Date) {
          const { startAt } = this as unknown as IProduct;
          return moment(endAt).isAfter(startAt, 'hour');
        },
        message: '活動結束時間必須晚於活動開始時間至少一個小時',
      },
    },
    sellStartAt: {
      type: Date,
      required: true,
      validate: {
        validator: (sellStartAt: Date) => {
          return moment().isBefore(moment(sellStartAt), 'day');
        },
        message: '販賣開始時間必須晚於現在時間至少一天',
      },
    },
    sellEndAt: {
      type: Date,
      required: true,
      validate: {
        validator: function (sellEndAt: Date) {
          const { sellStartAt } = this as unknown as IProduct;
          return moment(sellEndAt).isAfter(sellStartAt, 'hour');
        },
        message: '販賣結束時間必須晚於販賣開始時間至少一個小時',
      },
    },
    recommendWeight: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      select: true, // 只有管理者可以看到
    },
    isPublic: {
      type: Boolean,
      required: true,
      select: true, // 只有管理者可以看到
    },
    isLaunched: {
      type: Boolean,
      required: true,
      validate: {
        validator: function (isLaunched: boolean) {
          const { isPublic } = this as unknown as IProduct;
          return !(isLaunched && !isPublic);
        },
        message: '尚未公開的情況下，商品不可以進行販賣',
      },
    },
    tags: {
      type: [{ tagId }],
    },
    photoPath,
    notifications: {
      type: [String],
    },
    highlights: {
      type: [String],
    },
    introduction: {
      type: String,
      required: true,
      trim: true,
    },
    cautions: {
      type: [String],
    },
    confirmations: {
      type: [String],
    },
    cancelPolicies: {
      type: [String],
    },
    certificates: {
      type: [String],
    },
    comments: {
      type: [commentId],
    },
  },
  schemaOption,
);

// 避免重複商品
schema.index(
  {
    startAt: 1,
    endAt: 1,
    theater: 1,
    title: 1,
    vendor: 1,
  },
  { unique: true },
);

const ProductModel = model<IProduct>('Product', schema);

export default ProductModel;
