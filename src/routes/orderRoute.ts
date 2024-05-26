import { BaseRoute } from './baseRoute';
import UserController from '../controller/userController';
import { UserVerify } from '../middleware/userVerify';
import OrderController from "../controller/orderController";

export class OrderRoute extends BaseRoute {
  protected controller!: OrderController;

  constructor() {
    super();
    this.initial();
  }

  protected initial(): void {
    this.controller = new OrderController();
    this.setRouters();
  }

  protected setRouters(): void {
    this.router.post(
      '/v1/order',
      /**
       * #swagger.tags = ['Account']
       * #swagger.summary = '取得使用者資料'
       * #swagger.security=[{"Bearer": []}],
       */
      /**
       #swagger.responses[200] = {
       description: 'OK',
       schema: {
       $ref: '#/definitions/UserDetail' }
       }
       */
      UserVerify,
      this.responseHandler(this.controller.createOrder),
    );
    this.router.post(
      '/v1/order/newebpay_return',
      /**
       * #swagger.tags = ['Account']
       * #swagger.summary = '取得使用者資料'
       * #swagger.security=[{"Bearer": []}],
       */
      /**
       #swagger.responses[200] = {
       description: 'OK',
       schema: {
       $ref: '#/definitions/UserDetail' }
       }
       */
      UserVerify,
      this.responseHandler(this.controller.createOrder),
    );
    this.router.post(
      '/v1/order/newebpay_notify',
      /**
       * #swagger.tags = ['Order']
       * #swagger.summary = '藍新金流回傳交易結果'
       * #swagger.security=[{"Bearer": []}],
       */
      /**
       #swagger.responses[200] = {
       description: 'OK',
       schema: {
       $ref: '#/definitions/UserDetail' }
       }
       */
      this.responseHandler(this.controller.newebpayNotify),
    );
  }
}
