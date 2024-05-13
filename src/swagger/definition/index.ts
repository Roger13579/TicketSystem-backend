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
  CustomCreateProductsObj,
  CreateProductsSuccess,
  CustomGetProductTitleQuery,
  CustomGetProductTypesQuery,
  CustomGetProductGenresQuery,
  CustomGetProductTheatersQuery,
  CustomGetProductVendorsQuery,
  CustomGetProductIsPublicQuery,
  CustomGetProductIsLaunchedQuery,
  CustomGetProductSellStartFromQuery,
  CustomGetProductStartAtFromQuery,
  CustomGetProductStartAtToQuery,
  CustomGetProductRecommendWeightQuery,
  CustomGetProductPriceMaxQuery,
  CustomGetProductSellStartToQuery,
  CustomGetProductLimitQuery,
  CustomGetProductPageQuery,
  CustomGetProductPriceMinQuery,
  CustomGetProductSortByQuery,
  CustomGetProductTagQuery,
} from './product';
import {
  CreateGroupSuccess,
  CustomCreateGroupObj,
  CustomUpdateGroupObj,
} from './group';
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
  CreateProductsSuccess,
  CreateProductsError,
  CreateGroupSuccess,
  UploadFileSuccess,
};

export const customDefinitions = {
  CustomCreateProductsObj,
  CustomGetProductTitleQuery,
  CustomGetProductTypesQuery,
  CustomGetProductGenresQuery,
  CustomGetProductVendorsQuery,
  CustomGetProductTheatersQuery,
  CustomGetProductIsLaunchedQuery,
  CustomGetProductIsPublicQuery,
  CustomGetProductStartAtFromQuery,
  CustomGetProductStartAtToQuery,
  CustomGetProductSellStartFromQuery,
  CustomGetProductSellStartToQuery,
  CustomGetProductRecommendWeightQuery,
  CustomGetProductPriceMaxQuery,
  CustomGetProductPriceMinQuery,
  CustomGetProductTagQuery,
  CustomGetProductPageQuery,
  CustomGetProductLimitQuery,
  CustomGetProductSortByQuery,
  CustomCreateGroupObj,
  CustomUpdateGroupObj,
};
