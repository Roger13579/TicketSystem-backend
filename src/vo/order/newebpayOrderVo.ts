export class NewebpayOrderVo {
  private readonly orderId: string;
  private readonly merchantID: string;
  private readonly tradeSha: string;
  private readonly tradeInfo: string;
  private readonly version: string;
  private readonly paymentGateway: string;

  constructor(orderId: string, tradeSha: string, tradeInfo: string) {
    this.orderId = orderId;
    this.merchantID = process.env.NEWEBPAY_MERCHANT_ID;
    this.tradeSha = tradeSha;
    this.tradeInfo = tradeInfo;
    this.version = process.env.NEWEBPAY_VERSION;
    this.paymentGateway = process.env.NEWEBPAY_PAY_GATEWAY;
  }
}
