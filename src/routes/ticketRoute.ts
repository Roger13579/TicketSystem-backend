import { BaseRoute } from './baseRoute';
import { TicketController } from '../controller/ticketController';

export class TicketRoute extends BaseRoute {
  protected controller!: TicketController;

  constructor() {
    super();
    this.initial();
  }

  protected initial(): void {
    this.controller = new TicketController();
    this.setRouters();
  }

  protected setRouters(): void {
    this.router.post(
      '/v1/ticket',
      /**
       * 測試用新增票券
       */
      this.responseHandler(this.controller.createTicket),
    );

    this.router.get(
      '/v1/ticket',
      /**
       * #swagger.tags = ['Ticket']
       * #swagger.summary = '取得票券列表'
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
      // UserCheck,
      // this.usePipe(GetOrderPipe),
      this.responseHandler(this.controller.getTickets),
    );
  }
}
