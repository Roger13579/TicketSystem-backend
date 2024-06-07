import { BaseRoute } from './baseRoute';
import { TicketController } from '../controller/ticketController';
import { UserCheck, UserVerify } from '../middleware/userVerify';
import { GetTicketPipe } from '../validator/ticket/getTicket.pipe';
import { IsAdmin } from '../middleware/isAdmin';
import { VerifyTicketsPipe } from '../validator/ticket/verifyTickets.pipe';

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
            description: '模糊搜尋：商品名稱(Admin 專用)',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetTicketProductName"
            }
          }
          #swagger.parameters['isPublished'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：是否上架分票',
            type: 'boolean',
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
          #swagger.parameters['sortField'] = {
            in: 'query',
            required: false,
            description: '排序根據',
            type: 'string',
            enum: ["createdAt", "expiredAt", "status"],
            schema:{
              $ref: "#/definitions/CustomSortFieldQuery"
            }
          }
          #swagger.parameters['sortOrder'] = {
            in: 'query',
            required: false,
            description: '排序順序',
            type: 'string',
            enum: ["asc", "desc"],
            schema:{
              $ref: "#/definitions/CustomSortOrderQuery"
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

    this.router.patch(
      '/v1/ticket',
      /**
       * #swagger.tags = ['Ticket']
       * #swagger.summary = '批次核銷票券'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['obj'] ={
          in:'body',
          description:'欲核銷的票券列表',
          schema:{
            $ref:"#/definitions/CustomVerifyTicketsObj"
          }
        } 
       */
      /**
        #swagger.responses[200]={
          description:'OK，要全部票券通過才會真正核銷',
          schema:{
            $ref:'#/definitions/VerifyTicketsSuccess'
          }
        }
       */
      UserVerify,
      IsAdmin,
      this.usePipe(VerifyTicketsPipe),
      this.responseHandler(this.controller.verifyTickets),
    );
  }
}
