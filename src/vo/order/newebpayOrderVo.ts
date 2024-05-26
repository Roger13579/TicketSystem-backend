export class NewebpayOrderVo {
  private readonly merchantID: string;
  private readonly tradeSha: string;
  private readonly tradeInfo: string;
  private readonly version: string;

  constructor(tradeSha: string, tradeInfo: string) {
    this.merchantID = process.env.MERCHANT_ID as string;
    this.tradeSha = tradeSha;
    this.tradeInfo = tradeInfo;
    this.version = process.env.VERSION as string;
  }
}
