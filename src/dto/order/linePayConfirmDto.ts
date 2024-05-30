import { ILinePayConfirmReq } from '../../types/order.type';

export class LinePayConfirmDTO {
  private readonly _transactionId: string;
  private readonly _orderId: string;

  get transactionId() {
    return this._transactionId;
  }

  get orderId() {
    return this._orderId;
  }

  constructor(req: ILinePayConfirmReq) {
    const { orderId, transactionId } = req.body;
    this._orderId = orderId || '';
    this._transactionId = transactionId || '';
  }
}
