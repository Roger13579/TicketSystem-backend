export const enum CustomResponseType {
  OK = '6000',
  OK_MESSAGE = '成功',
  OK_REGISTER_EMAIL_MESSAGE = '請至信箱確認是否收到驗證信',

  FORMAT_ERROR = '6101',
  FORMAT_ERROR_MESSAGE = '輸入格式錯誤：',

  FILE_TYPE_ERROR = '6102',
  FILE_TYPE_ERROR_MESSAGE = '檔案格式錯誤',

  IMAGE_TYPE_ERROR = '6103',
  IMAGE_TYPE_ERROR_MESSAGE = '圖片格式錯誤',

  PWD_CONFIRMED_NOT_THE_SAME = '6104',
  PWD_CONFIRMED_NOT_THE_SAME_MESSAGE = '密碼與確認密碼不同',

  UNREGISTERED_USER = '6201',
  UNREGISTERED_USER_MESSAGE = '尚未註冊，查詢不到此用戶',

  WRONG_PASSWORD = '6202',
  WRONG_PASSWORD_MESSAGE = '密碼錯誤',

  ACCOUNT_REGISTERED = '6203',
  ACCOUNT_REGISTERED_MESSAGE = '帳號已被註冊：',

  UNKNOWN_ERROR = '6204',
  UNKNOWN_ERROR_MESSAGE = '不明錯誤',

  EMAIL_VERIFICATION_FAILED = '6205',
  EMAIL_VERIFICATION_FAILED_MESSAGE = '忘記密碼信箱驗證失敗',

  CAN_NOT_USE_OLD_PASSWORD = '6206',
  CAN_NOT_USE_OLD_PASSWORD_MESSAGE = '不可使用舊密碼',

  NO_DATA_FOUND = '6207',
  NO_DATA_FOUND_MESSAGE = '查無資料',

  OLD_PASSWORD_INCORRECT = '6208',
  OLD_PASSWORD_INCORRECT_MESSAGE = '您的舊密碼不正確',

  WRITE_OFF_FAILED = '6210',
  WRITE_OFF_FAILED_MESSAGE = '票券核銷失敗',

  PAGINATION_INFO_MISSING = '6211',
  PAGINATION_INFO_MISSING_MESSAGE = '沒有給適當的分頁資訊',

  PRODUCT_NOT_FOUND = '6212',
  PRODUCT_NOT_FOUND_MESSAGE = '無此商品 ID',

  INSERT_ERROR = '6213',
  INSERT_ERROR_MESSAGE = '新增錯誤：',

  UPDATE_ERROR = '6214',
  UPDATE_ERROR_MESSAGE = '更新錯誤',

  DELETE_ERROR = '6215',
  DELETE_ERROR_MESSAGE = '刪除錯誤：',

  EMAIL_REGISTERED = '6216',
  EMAIL_REGISTERED_MESSAGE = '信箱已被註冊：',

  TOKEN_GENERATE_ERROR = '6301',
  TOKEN_GENERATE_ERROR_MESSAGE = 'token 建立失敗',

  TOKEN_EXPIRED = '6302',
  TOKEN_EXPIRED_MESSAGE = 'token 過期',

  NOT_LOGIN = '6303',
  NOT_LOGIN_MESSAGE = '尚未登入',

  PERMISSION_DENIED = '6401',
  PERMISSION_DENIED_MESSAGE = '不允許使用該方法：',

  ACCOUNT_DISABLED = '6402',
  ACCOUNT_DISABLED_MESSAGE = '此帳號已停用',

  NOT_SUCH_ROUTE = '6404',
  NOT_SUCH_ROUTE_MESSAGE = '無此路由資訊',

  SYSTEM_ERROR = '6501',
  SYSTEM_ERROR_MESSAGE = '系統錯誤',

  IMAGE_UPLOAD_ERROR = '6502',
  IMAGE_UPLOAD_ERROR_MESSAGE = '上傳圖片失敗',

  PAYMENT_FAILED = '6503',
  PAYMENT_FAILED_MESSAGE = '付款失敗',

  REGISTER_EMAIL_ERROR = '6504',
  REGISTER_EMAIL_ERROR_MESSAGE = '請稍後重試或聯絡管理員',

  VALIDATE_EMAIL_ERROR = '6505',
  VALIDATE_EMAIL_ERROR_MESSAGE = '信箱驗證失敗',

  INVALID_PRODUCT_FILTER = '6506',
  INVALID_PRODUCT_FILTER_MESSAGE = '無效的商品條件：',

  INVALID_TIME = '6507',
  INVALID_TIME_MESSAGE = '無效的時間',

  INVALID_NUMBER = '6508',
  INVALID_NUMBER_MESSAGE = '無效的數字',

  INVALID_TIME_ORDER = '6509',
  INVALID_TIME_ORDER_MESSAGE = '錯誤的時間順序',

  INVALID_BOOLEAN = '6510',
  INVALID_BOOLEAN_MESSAGE = '無效的 Boolean 值',

  GOOGLE_AUTH_ERROR = '6511',
  GOOGLE_AUTH_ERROR_MESSAGE = 'Google第三方登入錯誤',

  INVALID_UPLOAD = '6513',
  INVALID_UPLOAD_MESSAGE = '無效的檔案上傳：',

  INVALID_CREATE_PRODUCT = '6514',
  INVALID_CREATE_PRODUCT_MESSAGE = '無效的商品新增：',

  GROUP_IS_FULL = '6515',
  GROUP_IS_FULL_MESSAGE = '揪團人數已滿',

  GROUP_ALREADY_JOINED = '6516',
  GROUP_ALREADY_JOINED_MESSAGE = '已加入此揪團活動',

  INVALID_EDIT_PRODUCT = '6517',
  INVALID_EDIT_PRODUCT_MESSAGE = '無效的商品編輯：',

  INVALID_DELETE_PRODUCT = '6518',
  INVALID_DELETE_PRODUCT_MESSAGE = '無效的商品刪除：',

  EXISTED_COMMENT = '6519',
  EXISTED_COMMENT_MESSAGE = '該使用者已經對該商品進行評論',

  INVALID_COMMENT_PRODUCT = '6520',
  INVALID_COMMENT_PRODUCT_MESSAGE = '無效的新增評論：',

  INVALID_DELETE_COMMENT = '6521',
  INVALID_DELETE_COMMENT_MESSAGE = '無效的刪除評論：',

  INVALID_COMMENT_FILTER = '6523',
  INVALID_COMMENT_FILTER_MESSAGE = '無效的評論條件：',

  INVALID_GROUP_FILTER = '6524',
  INVALID_GROUP_FILTER_MESSAGE = '無效的揪團查詢條件：',

  GROUP_OWNER_CAN_NOT_LEAVE = '6525',
  GROUP_OWNER_CAN_NOT_LEAVE_MESSAGE = '揪團發起人無法退出',

  GROUP_MEMBER_NOT_EMPTY = '6526',
  GROUP_MEMBER_NOT_EMPTY_MESSAGE = '揪團中尚有團員，無法刪除',

  NOT_GROUP_OWNER = '6527',
  NOT_GROUP_OWNER_MESSAGE = '非揪團發起人，無法刪除',

  INVALID_EDIT_CART = '6528',
  INVALID_EDIT_CART_MESSAGE = '無效的購物車編輯行為：',

  INVALID_ADD_CART = '6529',
  INVALID_ADD_CART_MESSAGE = '無效的購物車新增行為：',

  PRODUCT_SOLD_OUT = '6530',
  PRODUCT_SOLD_OUT_MESSAGE = '商品已售完',

  PAYMENT_ERROR_TRADESHA = '6531',
  PAYMENT_ERROR_TRADESHA_MESSAGE = '付款失敗：TradeSha 不一致',

  INVALID_TAG_FILTER = '6532',
  INVALID_TAG_FILTER_MESSAGE = '無效的標籤條件：',

  INVALID_ORDER_FILTER = '6533',
  INVALID_ORDER_FILTER_MESSAGE = '無效的訂單查詢條件：',

  INVALID_ORDER_PRICE = '6534',
  INVALID_ORDER_PRICE_MESSAGE = '訂單金額錯誤',

  LINEPAY_ERROR = '6535',
  LINEPAY_ERROR_MESSAGE = 'LinePay 發生錯誤',

  ORDER_PLAN_ERROR = '6536',
  ORDER_PLAN_ERROR_MESSAGE = '訂單中的方案錯誤',

  INVALID_TICKET_FILTER = '6537',
  INVALID_TICKET_FILTER_MESSAGE = '無效的票券查詢條件：',

  EDIT_COMMENT_ERROR = '6538',
  EDIT_COMMENT_ERROR_MESSAGE = '無效的評論編輯：',

  EDIT_FAVORITE_ERROR = '6539',
  EDIT_FAVORITE_ERROR_MESSAGE = '無效的編輯收藏：',

  INVALID_DELETE_CART = '6540',
  INVALID_DELETE_CART_MESSAGE = '無效的購物車刪除行為：',

  INVALID_VERIFIED_TICKET = '6541',
  INVALID_VERIFIED_TICKET_MESSAGE = '無效的票券核銷：',

  INVALID_EDIT_TICKET = '6542',
  INVALID_EDIT_TICKET_MESSAGE = '無效的票券編輯：',

  TRANSFER_TICKET_ERROR = '6543',
  TRANSFER_TICKET_ERROR_MESSAGE = '分票錯誤：',

  TRANSFER_TICKET_CREATE_ERROR = '6544',
  TRANSFER_TICKET_CREATE_ERROR_MESSAGE = '產生分票驗證碼錯誤：',

  TICKET_NOT_FOUND = '6545',
  TICKET_NOT_FOUND_MESSAGE = '票券不存在',

  INVALID_TICKET_DELETE = '6546',
  INVALID_TICKET_DELETE_MESSAGE = '無效的票券刪除行為',

  TICKET_NOT_ENOUGH = '6547',
  TICKET_NOT_ENOUGH_MESSAGE = '欲票券之票券數量不足',
}
