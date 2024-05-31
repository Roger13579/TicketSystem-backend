export class NewebpayOrderVo {
  private readonly merchantID: string;
  private readonly tradeSha: string;
  private readonly tradeInfo: string;
  private readonly version: string;
  private readonly paymentGateway: string;

  constructor(tradeSha: string, tradeInfo: string) {
    this.merchantID = process.env.NEWEBPAY_MERCHANT_ID;
    this.tradeSha = tradeSha;
    this.tradeInfo = tradeInfo;
    this.version = process.env.NEWEBPAY_VERSION;
    this.paymentGateway = process.env.NEWEBPAY_PAY_GATEWAY;
  }
}
