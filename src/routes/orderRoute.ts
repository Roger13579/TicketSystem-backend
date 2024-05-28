import { BaseRoute } from './baseRoute';
import { UserCheck, UserVerify } from '../middleware/userVerify';
import OrderController from '../controller/orderController';
import { CreateOrderPipe } from '../validator/order/createOrderPipe';
import { GetOrderPipe } from '../validator/order/getOrder.pipe';

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
       $ref: '#/definitions/CreateOrdersSuccess' }
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

    this.router.get(
      '/v1/order',
      /**
       * #swagger.tags = ['Order']
       * #swagger.summary = '取得訂單列表'
       * #swagger.security=[{"Bearer": []}],
       */
      /*  #swagger.parameters['status'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：訂單狀態',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomGetOrderStatusQuery"
            }
          }
          #swagger.parameters['ids'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：訂單編號列表',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomGetOrderIdQuery"
            }
          }
          #swagger.parameters['thirdPartyPaymentIds'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：第三方金流訂單編號列表',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetOrderThirdPartyPaymentIdQuery"
            }
          }
          #swagger.parameters['accounts'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：帳號列表',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetOrderAccountQuery"
            }
          }
          #swagger.parameters['emails'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：email列表',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetOrderEmailQuery"
            }
          }
          #swagger.parameters['phones'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：電話號碼列表',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetOrderPhoneQuery"
            }
          }

          #swagger.parameters['createdAtFrom'] = {
            in: 'query',
            required: false,
            description: '訂單成立時間-起',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomTimeAtFromQuery"
            }
          }
          #swagger.parameters['createdAtTo'] = {
            in: 'query',
            required: false,
            description: '訂單成立時間-迄',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomTimeAtToQuery"
            }
          }
          #swagger.parameters['paidAtFrom'] = {
            in: 'query',
            required: false,
            description: '付款時間-起',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomTimeAtFromQuery"
            }
          }
          #swagger.parameters['paidAtTo'] = {
            in: 'query',
            required: false,
            description: '付款時間-迄',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomTimeAtToQuery"
            }
          }
          #swagger.parameters['page'] = {
            in: 'query',
            required: true,
            description: '頁數',
            type: 'number',
            schema:{
              $ref: "#/definitions/CustomPageQuery"
            }
          }
          #swagger.parameters['limit'] = {
            in: 'query',
            required: false,
            description: '每頁資料數',
            type: 'number',
            schema:{
              $ref: "#/definitions/CustomLimitQuery"
            }
          }
          #swagger.parameters['sortBy'] = {
            in: 'query',
            required: false,
            description: '排序根據, e.g. createdAt, status,降冪則在前面加上 - ',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomSortByQuery"
            }
          }
      */
      /*
          #swagger.responses[200] = {
            description:'OK',
            schema:{
              $ref: "#/definitions/GetOrdersSuccess"
            }
          }
      */
      UserCheck,
      this.usePipe(GetOrderPipe),
      this.responseHandler(this.controller.getOrders),
    );
  }
}
