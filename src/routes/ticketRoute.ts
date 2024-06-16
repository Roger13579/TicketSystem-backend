import { BaseRoute } from './baseRoute';
import { TicketController } from '../controller/ticketController';
import { UserCheck, UserVerify } from '../middleware/userVerify';
import { GetTicketPipe } from '../validator/ticket/getTicket.pipe';
import { IsAdmin } from '../middleware/isAdmin';
import { VerifyTicketsPipe } from '../validator/ticket/verifyTickets.pipe';
import { EditTicketsPipe } from '../validator/ticket/editTickets.pipe';
import { TransferTicketPipe } from '../validator/ticket/TransferTicket.pipe';
import { ClaimTransferTicketPipe } from '../validator/ticket/claimTransferTicket.pipe';
import { DeleteTicketsPipe } from '../validator/ticket/deleteTickets.pipe';
import { GetTicketDetailPipe } from '../validator/ticket/getTicketDetail.pipe';
import { GetSharedTicketPipe } from '../validator/ticket/getSharedTicket.pipe';

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
            enum: ["verified", "unverified", "refunded", "expired", "cancelled", "pending", "transfer"],
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

    this.router.get(
      '/v1/ticket/:id',
      /**
       * #swagger.tags = ['Ticket']
       * #swagger.summary = '取得票券詳細資料'
       * #swagger.security=[{"Bearer": []}],
       */
      /*
        #swagger.parameters['id'] = {
          in: 'path',
          description: '票券 id',
          example: 'abcdefg123124',
        }
      */
      /*
          #swagger.responses[200] = {
            description:'OK',
            schema:{
              $ref: "#/definitions/GetTicketDetailSuccess"
            }
          }
      */
      UserVerify,
      this.usePipe(GetTicketDetailPipe),
      this.responseHandler(this.controller.getTicketDetail),
    );

    this.router.get(
      '/v1/ticket-shared',
      /**
       * #swagger.tags = ['Ticket']
       * #swagger.summary = '取得已上架分票票券'
       */
      /*
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
      */
      /*
          #swagger.responses[200] = {
            description:'OK',
            schema:{
              $ref: "#/definitions/GetSharedTicketsSuccess"
            }
          }
      */
      this.usePipe(GetSharedTicketPipe),
      this.responseHandler(this.controller.getSharedTickets),
    );

    this.router.patch(
      '/v1/ticket',
      /**
       * #swagger.tags = ['Admin']
       * #swagger.summary = '批次編輯票券'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['obj'] ={
          in:'body',
          description:'欲編輯的票券列表',
          schema:{
            $ref:"#/definitions/CustomEditTicketsObj"
          }
        } 
       */
      /**
        #swagger.responses[200]={
          description:'OK，要全部票券通過才會真正核銷',
          schema:{
            $ref:'#/definitions/EditTicketsSuccess'
          }
        }
       */
      UserVerify,
      IsAdmin,
      this.usePipe(EditTicketsPipe),
      this.responseHandler(this.controller.editTickets),
    );

    this.router.patch(
      '/v1/ticket/verify',
      /**
       * #swagger.tags = ['Admin']
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
            $ref:'#/definitions/EditTicketsSuccess'
          }
        }
       */
      UserVerify,
      IsAdmin,
      this.usePipe(VerifyTicketsPipe),
      this.responseHandler(this.controller.verifyTickets),
    );

    this.router.patch(
      '/v1/ticket/transfer/createCode',
      /**
       * #swagger.tags = ['Ticket']
       * #swagger.summary = '產生分票驗證碼'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['obj'] ={
          in:'body',
          description:'要產生分票驗證碼的票券資料',
          schema:{
            $ref:"#/definitions/CustomCreateShareCodeObj"
          }
        } 
       */
      /**
        #swagger.responses[200]={
          description:'OK',
          schema:{
            $ref:'#/definitions/TransferTicketSuccess'
          }
        }
       */
      UserVerify,
      this.usePipe(TransferTicketPipe),
      this.responseHandler(this.controller.createShareCode),
    );

    this.router.patch(
      '/v1/ticket/transfer/claim',
      /**
       * #swagger.tags = ['Ticket']
       * #swagger.summary = '使用驗證碼取得分票'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['obj'] ={
          in:'body',
          description:'要使用的分票驗證碼',
          schema:{
            $ref:"#/definitions/CustomClaimTicketObj"
          }
        } 
       */
      /**
        #swagger.responses[200]={
          description:'OK',
          schema:{
            $ref:'#/definitions/TransferTicketSuccess'
          }
        }
       */
      UserVerify,
      this.usePipe(ClaimTransferTicketPipe),
      this.responseHandler(this.controller.transferTicket),
    );

    this.router.delete(
      '/v1/ticket',
      /**
       * #swagger.tags = ['Admin']
       * #swagger.summary = '批次刪除票券'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['obj'] ={
          in:'body',
          description:'欲核銷的票券列表',
          schema:{
            $ref:"#/definitions/CustomDeleteTicketsObj"
          }
        } 
       */
      /**
        #swagger.responses[200]={
          description:'OK，要全部票券通過才會真正核銷',
          schema:{
            $ref:'#/definitions/EditTicketsSuccess'
          }
        }
       */
      UserVerify,
      IsAdmin,
      this.usePipe(DeleteTicketsPipe),
      this.responseHandler(this.controller.deleteTickets),
    );
  }
}
