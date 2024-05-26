import { BaseRoute } from './baseRoute';
import { UserVerify } from '../middleware/userVerify';
import OrderController from '../controller/orderController';
import { CreateOrderPipe } from '../validator/order/createOrderPipe';

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
       * #swagger.tags = ['Order']
       * #swagger.summary = '新增訂單'
       * #swagger.security=[{"Bearer": []}],
       */
      /*
          #swagger.parameters['obj'] ={
            in:'body',
            description:'從購物車取得的訂單資訊',
            schema:{
              $ref:"#/definitions/CustomCreateOrderObj"
            }
       }
       */
      /**
       #swagger.responses[200] = {
       description: 'OK',
       schema: {
       $ref: '#/definitions/Success' }
       }
       */
      UserVerify,
      this.usePipe(CreateOrderPipe),
      this.responseHandler(this.controller.createOrder),
    );
    this.router.post(
      '/v1/order/newebpay_notify',
      /**
       * #swagger.tags = ['Order']
       * #swagger.summary = '藍新金流回傳交易結果'
       * #swagger.security=[{"Bearer": []}],
       */
      this.responseHandler(this.controller.newebpayNotify),
    );
  }
}
