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
import {
  CreateGroupSuccess,
  CustomCreateGroupObj,
  CustomJoinGroupObj,
  CustomUpdateGroupObj,
} from './group';
import { productDefinition, productCustomDefinition } from './product';
import { UploadFileSuccess } from './upload';

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
  CreateProductsError,
  CreateGroupSuccess,
  UploadFileSuccess,
  ...productDefinition,
};

export const customDefinitions = {
  ...productCustomDefinition,
  CustomCreateGroupObj,
  CustomUpdateGroupObj,
  CustomJoinGroupObj,
};
