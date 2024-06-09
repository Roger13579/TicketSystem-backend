import {
  PaginateModel,
  PopulateOptions,
  Query,
  Schema,
  Types,
  model,
} from 'mongoose';
import { IProductSnapshot, IPlan } from '../types/product.type';
import { schemaOption } from '../utils/constants';
import moment from 'moment';
import {
  BaseModel,
  ModelName,
  productSnapshotSchemaDef,
  schemaDef,
} from './baseModel';
import paginate from 'mongoose-paginate-v2';
import { ITagId } from '../types/tag.type';
import { ICommentId } from '../types/comment.type';

export interface IProduct extends BaseModel, IProductSnapshot {
  plans?: IPlan[];
  startAt: Date;
  endAt: Date;
  sellStartAt: Date;
  sellEndAt: Date;
  recommendWeight: number;
  amount: number; // 票券總量
  isPublic: boolean;
  isLaunched: boolean;
  tags?: ITagId[];
  photoPath: string;
  notifications?: [string];
  highlights?: [string];
  introduction?: string;
  cautions?: [string];
  confirmations?: [string];
  cancelPolicies?: [string];
  certificates?: [string];
  comments?: ICommentId[];
  soldAmount: number;
  brief: string;
}

const { commentId, tagId, photoPath, plan } = schemaDef;

const schema = new Schema<IProduct>(
  {
    ...productSnapshotSchemaDef,
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
      type: [plan],
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
).plugin(paginate);

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

schema.pre<Query<unknown, IProduct>>(['find', 'findOne'], function (next) {
  const isTagsShown =
    this.projection() !== undefined && this.projection().tags === 1;
  // 沒有要取 tags 的資料，就不需要 populate
  if (isTagsShown) {
    const populateOptions: PopulateOptions = {
      path: 'tags.tagId',
      select: 'name -_id',
    };
    this.populate(populateOptions);
  }

  next();
});

// 針對 Document 的細部結構轉換流程都寫在這裡，Vo 僅提供哪些資料要顯示

interface ITransformTag {
  tagId: { name: string };
  _id: Types.ObjectId;
}

const transform = (_doc: unknown, ret: Record<string, unknown>) => {
  if (!!ret.tags) {
    ret.tags = (ret.tags as ITransformTag[]).map((tag) => ({
      name: tag.tagId.name,
      _id: tag._id,
    }));
  }
  if (!!ret.plans) {
    ret.plans = (ret.plans as IPlan[]).map((plan) => ({
      name: plan.name,
      discount: plan.discount,
      headCount: plan.headCount,
    }));
  }
  delete ret.id;
  return ret;
};

schema.set('toJSON', {
  virtuals: true,
  transform,
});

schema.set('toObject', {
  virtuals: true,
  transform,
});

const ProductModel = model<IProduct, PaginateModel<IProduct>>(
  ModelName.product,
  schema,
);

export default ProductModel;
