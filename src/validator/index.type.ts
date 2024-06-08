import { Meta, ValidationChain } from 'express-validator';

export type TCustomValidator<V> = (value: V, { req }: Meta) => boolean;

export enum OptionType {
  array,
  item,
}

export type TCustomValidation = (
  chain: ValidationChain,
  message: string,
) => ValidationChain;
