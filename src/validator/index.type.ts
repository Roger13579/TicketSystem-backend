import { Meta } from 'express-validator';

export type TCustomValidator = (
  value: string | undefined,
  meta: Meta,
) => boolean;

export enum OptionType {
  array,
  item,
}
