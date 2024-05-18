import { CustomResponseType } from '../../types/customResponseType';
import { HttpStatus } from '../../types/responseType';

export const Success = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {},
};

export const Error6202 = {
  $status: CustomResponseType.WRONG_PASSWORD,
  $message: CustomResponseType.WRONG_PASSWORD_MESSAGE,
};

export const ErrorToken = {
  $status: CustomResponseType.NOT_LOGIN,
  $message: CustomResponseType.NOT_LOGIN_MESSAGE,
};

export const Error404 = {
  $status: HttpStatus.NOT_FOUND,
  $message: '找不到頁面',
};

export const Error500 = {
  $status: HttpStatus.INTERNAL_ERROR,
  $message: '系統錯誤，請稍後再試',
};

export const SignUpForm = {
  account: 'roger',
  email: 'roger@gmail.com',
  pwd: '12345678',
  confirmPwd: '12345678',
};
export const ForgotPwdForm = {
  email: 'roger@gmail.com',
};
export const ResetPwdForm = {
  oldPwd: '12345678',
  pwd: '111222333',
  confirmPwd: '111222333',
};
export const LoginForm = {
  account: 'rrroger',
  pwd: '123123123',
};
export const LoginSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    account: 'rrroger',
    email: 'roger@gmail.com',
    token: 'token',
    accountType: 'member',
  },
};

export const UserDetail = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {
    name: 'roger',
    createdAt: '2024-05-02T14:54:58.972Z',
    birthDate: null,
    email: 'roger@gmail.com',
    gender: 'none',
    phone: '0912345678',
    address: 'aaaabbb',
    imgUrl: '',
  },
};

export const UpdateUserDetail = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_MESSAGE,
  $data: {},
};

export const CreateProductsError = {
  $status: CustomResponseType.INSERT_ERROR,
  $message: CustomResponseType.INSERT_ERROR_MESSAGE,
};

export const RegisterEmailSuccess = {
  $status: CustomResponseType.OK,
  $message: CustomResponseType.OK_REGISTER_EMAIL_MESSAGE,
};

export const RegisterEmailError = {
  $status: CustomResponseType.REGISTER_EMAIL_ERROR,
  $message: CustomResponseType.REGISTER_EMAIL_ERROR_MESSAGE,
};

export const ValidateEmailError = {
  $status: CustomResponseType.VALIDATE_EMAIL_ERROR,
  $message: CustomResponseType.VALIDATE_EMAIL_ERROR_MESSAGE,
};

export const CustomBooleanQuery = {
  example: 'true',
};

export const CustomPageQuery = {
  example: '1',
};
export const CustomLimitQuery = {
  example: '10',
};
export const CustomSortByQuery = {
  example: '-createdAt',
};

export const CustomTimeAtFromQuery = {
  example: '2024-05-16T03:33:20.000+00:00',
};
export const CustomTimeAtToQuery = {
  example: '2024-05-17T03:33:20.000+00:00',
};

export const CustomStatusQuery = {
  example: 'active',
};
