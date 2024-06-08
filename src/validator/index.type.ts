import { Meta, ValidationChain } from 'express-validator';

export type TCustomValidator<V = string | undefined> = (
  value: V,
  { req }: Meta,
) => boolean;

export enum OptionType {
  array,
  item,
}

export type TCustomValidation = (
  chain: ValidationChain,
  message: string,
) => ValidationChain;

export interface IValidateExclusiveQueryParams {
  propNames: string[];
  select?: number;
  isAcceptEmpty?: boolean;
}
