export class NewebpayOrderVo {
  private readonly orderId: string;
  private readonly MerchantID: string;
  private readonly TradeSha: string;
  private readonly TradeInfo: string;
  private readonly Version: string;
  private readonly paymentGateway: string;

  constructor(orderId: string, tradeSha: string, tradeInfo: string) {
    this.orderId = orderId;
    this.MerchantID = process.env.NEWEBPAY_MERCHANT_ID;
    this.TradeSha = tradeSha;
    this.TradeInfo = tradeInfo;
    this.Version = process.env.NEWEBPAY_VERSION;
    this.paymentGateway = process.env.NEWEBPAY_PAY_GATEWAY;
  }
}
