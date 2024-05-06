const Success = {
  status: '6000',
  message: '成功',
  data: {},
};

const Error6202 = {
  status: '6202',
  message: '密碼錯誤',
  data: {},
};

const ErrorToken = {
  status: 'false',
  message: '你尚未登入',
  error: {
    name: '40300',
  },
};

const Error404 = {
  message: '找不到頁面',
};

const Error500 = {
  message: '系統錯誤，請稍後再試',
};

const signUpForm = {
  account: 'roger',
  email: 'roger@gmail.com',
  pwd: '12345678',
  confirmPwd: '12345678',
};
const forgotPwdForm = {
  email: 'roger@gmail.com',
};
const resetPwdForm = {
  oldPwd: '12345678',
  pwd: '111222333',
  confirmPwd: '111222333',
};
const loginForm = {
  account: 'rrroger',
  pwd: '123123123',
};
const loginSuccess = {
  status: '6000',
  message: '成功',
  data: {
    account: 'rrroger',
    email: 'roger@gmail.com',
    token: 'token',
    accountType: 'member',
  },
};

const userDetail = {
  status: '6000',
  message: '成功',
  data: {
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

const updateUserDetail = {
  status: '6000',
  message: '成功',
  data: {},
};

const RegisterEmailSuccess = {
  status: 'success',
  message: '請至信箱確認是否收到驗證信',
};

const RegisterEmailError = {
  message: '請稍後重試或聯絡管理員',
};

const ValidateEmailError = {
  message: '信箱驗證失敗',
};

export const definitions = {
  Success,
  Error6202,
  ErrorToken,
  Error404,
  Error500,
  signUpForm,
  forgotPwdForm,
  resetPwdForm,
  loginForm,
  loginSuccess,
  userDetail,
  updateUserDetail,
  RegisterEmailSuccess,
  RegisterEmailError,
  ValidateEmailError,
};
