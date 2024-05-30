export enum LinePayReturnCode {
  success = '0000',
}

export enum LinePayCurrency {
  USD = 'USD',
  JPY = 'JPY',
  TWD = 'TWD',
  THB = 'THB',
}

export enum LinePayLocale {
  en = 'en',
  ja = 'ja',
  ko = 'ko',
  th = 'th',
  zh_TW = 'zh_TW',
  zh_CN = 'zh_CN',
}

enum PayInfoMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  BALANCE = 'BALANCE',
  DISCOUNT = 'DISCOUNT',
  POINT = 'POINT',
}

enum LinePayCardType {
  MOBILE_CARRIER = 'MOBILE_CARRIER',
}

enum CreditCardBranch {
  VISA = 'VISA',
  MASTER = 'MASTER',
  AMEX = 'AMEX',
  DINERS = 'DINERS',
  JCB = 'JCB',
}

enum IShippingType {
  NO_SHIPPING = 'NO_SHIPPING',
  FIXED_ADDRESS = 'FIXED_ADDRESS',
  SHIPPING = 'SHIPPING',
}

enum IFeeInquiryType {
  CONDITION = 'CONDITION',
  FIXED = 'FIXED',
}

enum LinePayPayType {
  NORMAL = 'NORMAL',
  PREAPPROVED = 'PREAPPROVED',
}

interface LinePackageProduct {
  id?: string; // 商家商品ID
  name: string; //商品名
  imageUrl?: string; // 商品圖示的URL
  quantity: number; // 商品數量
  price: number; // 各商品付款金額
  originalPrice?: number; // 各商品原金額
}

interface IDataBase {
  returnCode: LinePayReturnCode;
  returnMessage?: string;
}

interface IRedirectUrls {
  appPackageName?: string; //	在Android環境切換應用時所需的資訊，用於防止網路釣魚攻擊（phishing）
  confirmUrl: string; //使用者授權付款後，跳轉到該商家URL
  confirmUrlType?: string; //	使用者授權付款後，跳轉的confirmUrl類型
  cancelUrl: string; //	使用者通過LINE付款頁，取消付款後跳轉到該URL
}

interface IPaymentOptions {
  capture?: boolean; //是否自動請款
  payType?: LinePayPayType; // 付款類型
}

interface IDisplayOptions {
  locale?: LinePayLocale; // 等待付款頁的語言程式碼，預設為英文（en）
  checkConfirmUrlBrowser?: boolean; //	檢查將用於訪問confirmUrl的瀏覽器
}

interface IAddFriend {
  type?: string; // 新增好友的服務類型
  idList?: unknown[]; // 各服務類型的ID list
}

interface IFamilyServicesOptions {
  addFriends?: IAddFriend[];
}

interface IPromotionREstriction {
  useLimit: number;
  rewardLimit: number;
}

interface IExtraOptions {
  branchName?: string; //	商店或分店名稱(僅會顯示前 100 字元)
  branchId?: string; //	商店或分店代號，可支援英數字及特殊字元
  promotionRestriction?: IPromotionREstriction; // 點數限制資訊
}

interface IPayInfo {
  method: PayInfoMethod;
  amount: number;
  creditCardNickname: string;
  creditCardBrand: CreditCardBranch;
  maskedCreditCardNumber: string;
}

interface IPackage {
  id: string;
  userFeeAmount: number;
}

interface AffiliateCard {
  cardType?: LinePayCardType;
  cardId?: string;
}

interface IShippingAddressRecipient {
  firstName?: string; //	收貨人名
  lastName?: string; //	收貨人姓
  firstNameOptional?: string; // 詳細名資訊
  lastNameOptional?: string; //	詳細姓資訊
  email?: string; // 收貨人電子郵件
  phoneNo?: string; // 收貨人電話號碼
}

interface IShippingOptions {
  type?: IShippingType; // 收貨地選項
  feeAmount?: string; // 運費
  feeInquiryUrl?: string; // 查詢配送方式的URL
  feeInquiryType?: IFeeInquiryType; //	運費查詢類型
  address?: IShippingAddress;
}

interface ILinePayReqBodyBase {
  amount: number; //付款金額
  currency: LinePayCurrency; // 貨幣
}

interface IPaymentUrl {
  app: string;
  web: string;
}

export interface LinePayPackage {
  id: string; // Package list的唯一ID
  amount: number; // 一個Package中的商品總價
  userFee?: number; // 手續費：在付款金額中含手續費時設定
  name?: string; // Package名稱 （or Shop Name）
  products: LinePackageProduct[];
}

export interface IOptions {
  payment?: IPaymentOptions;
  display?: IDisplayOptions;
  shipping?: IShippingOptions;
  familyService?: IFamilyServicesOptions;
  extra?: IExtraOptions;
}

export interface IShippingAddress {
  country?: string; //	收貨國家
  postalCode?: string; //	收貨地郵政編碼
  state?: string; //	收貨地區
  city?: string; //	收貨省市區
  detail?: string; //	收貨地址
  optional?: string; //	詳細地址資訊
  recipient?: IShippingAddressRecipient;
}

export interface ILinePayRequestBody extends ILinePayReqBodyBase {
  orderId: string; // 商家訂單編號，商家管理的唯一ID
  packages: LinePayPackage[];
  redirectUrls: IRedirectUrls;
  options: IOptions;
}

export interface ILinePayConfirmBody extends ILinePayReqBodyBase {}

export interface ILinePayData extends IDataBase {
  info?: {
    transactionId: number;
    paymentAccessToken: string;
    paymentUrl: IPaymentUrl;
  };
}

export interface ILinePayConfirmData extends IDataBase {
  info?: {
    orderId: string;
    transactionId: number;
    authorizationExpireDate: string;
    regKey: string;
    payInfo: IPayInfo[];
    packages: IPackage[];
    merchantReference: { affiliateCards: AffiliateCard[] };
    shipping: Pick<IShippingOptions, 'address' | 'feeAmount'> & {
      address: IShippingAddress;
    };
  };
}

export interface ICreateLinePayReqParams {
  body: object;
  orderId: string;
  uri: string;
}
