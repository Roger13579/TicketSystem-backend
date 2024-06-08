import { QueryOptions } from 'mongoose';

export const schemaOption = {
  versionKey: false,
  timestamps: true,
};

export const updateOptions: QueryOptions = {
  new: true,
  runValidators: true,
  returnDocument: 'after',
};

export const booleanStrings = ['true', 'false'];

/**
 * default 的 virtuals 相關 option 設定
 * @description 如果 model 中有額外進行 toJSON 或 toObject 的操作的話，這段就會無效
 */
export const virtualSchemaOption = {
  toJSON: {
    virtuals: true,
    transform: (_doc: unknown, ret: Record<string, unknown>) => {
      delete ret.id;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_doc: unknown, ret: Record<string, unknown>) => {
      delete ret.id;
      return ret;
    },
  },
};
