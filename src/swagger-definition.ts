const Success = {
  message: '成功訊息',
};

const Error400 = {
  message: '錯誤訊息',
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

const Sign = {
  token: 'abcde',
  _id: '123456789',
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

export default {
  Success,
  Error400,
  ErrorToken,
  Error404,
  Error500,
  Sign,
  RegisterEmailSuccess,
  RegisterEmailError,
  ValidateEmailError,
};
