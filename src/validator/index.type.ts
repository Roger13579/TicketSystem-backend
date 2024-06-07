import { Meta } from 'express-validator';

export type TCustomValidator<T> = (value: T, meta: Meta) => boolean;

export enum OptionType {
  array,
  item,
}
