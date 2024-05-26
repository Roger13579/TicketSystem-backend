import { QueryOptions } from 'mongoose';

export const schemaOption = {
  versionKey: false,
  timestamps: true,
};

export const virtualSchemaOption = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

export const updateOptions: QueryOptions = {
  new: true,
  runValidators: true,
  returnDocument: 'after',
};
