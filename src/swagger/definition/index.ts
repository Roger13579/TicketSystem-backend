import {
  Success,
  Error6202,
  ErrorToken,
  Error404,
  Error500,
  SignUpForm,
  ForgotPwdForm,
  ResetPwdForm,
  LoginForm,
  LoginSuccess,
  UserDetail,
  UpdateUserDetail,
  RegisterEmailSuccess,
  RegisterEmailError,
  ValidateEmailError,
  CreateProductsError,
} from './common';
import { CustomCreateProductsObj, CreateProductsSuccess } from './product';

export const definitions = {
  Success,
  Error6202,
  ErrorToken,
  Error404,
  Error500,
  SignUpForm,
  ForgotPwdForm,
  ResetPwdForm,
  LoginForm,
  LoginSuccess,
  UserDetail,
  UpdateUserDetail,
  RegisterEmailSuccess,
  RegisterEmailError,
  ValidateEmailError,
  CreateProductsSuccess,
  CreateProductsError,
};

export const customDefinitions = {
  CustomCreateProductsObj,
};
