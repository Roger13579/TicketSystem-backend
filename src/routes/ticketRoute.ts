import { BaseRoute } from './baseRoute';
import { TicketController } from '../controller/ticketController';
import { UserCheck } from '../middleware/userVerify';
import { GetTicketPipe } from '../validator/ticket/getTicket.pipe';

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
            description: '精準搜尋：票券狀態',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomGetTicketStatusQuery"
            }
          }
          #swagger.parameters['ids'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：票券編號列表',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomGetTicketIdQuery"
            }
          }
          #swagger.parameters['productName'] = {
            in: 'query',
            required: false,
            description: '模糊搜尋：商品名稱',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetTicketProductName"
            }
          }
          #swagger.parameters['isPublished'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：是否上架分票',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetTicketIsPublished"
            }
          }
          #swagger.parameters['expiredAtFrom'] = {
            in: 'query',
            required: false,
            description: '有效時間-起',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomTimeAtFromQuery"
            }
          }
          #swagger.parameters['expiredAtTo'] = {
            in: 'query',
            required: false,
            description: '有效時間-迄',
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
              $ref: "#/definitions/GetTicketsSuccess"
            }
          }
      */
      UserCheck,
      this.usePipe(GetTicketPipe),
      this.responseHandler(this.controller.getTickets),
    );
  }
}
