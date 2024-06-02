import { CommentController } from '../controller/commentController';
import { IsAdmin } from '../middleware/isAdmin';
import { CreateCommentPipe } from '../validator/comment/createComment.pipe';
import { DeleteCommentsPipe } from '../validator/comment/deleteComments.pipe';
import { UserCheck, UserVerify } from '../middleware/userVerify';
import { GetCommentsPipe } from '../validator/comment/getComments.pipe';
import { BaseRoute } from './baseRoute';

export class CommentRoute extends BaseRoute {
  protected controller!: CommentController;

  constructor() {
    super();
    this.initial();
  }

  protected initial() {
    this.controller = new CommentController();
    this.setRouters();
  }

  protected setRouters() {
    this.router.get(
      '/v1/comment',
      /**
       * #swagger.tags = ['Comment']
       * #swagger.summary = '取得評論列表'
       */
      /*
          #swagger.parameters['limit'] = {
            in: 'query',
            required: true,
            description: '每頁資料數',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomLimitQuery"
            }
          } 
          #swagger.parameters['page'] = {
            in: 'query',
            required: true,
            description: '頁數',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomPageQuery"
            }
          } 
          #swagger.parameters['status'] = {
            in: 'query',
            required: false,
            description: '評論狀態，member 只能使用 active',
            type: 'string',
            enum:['active','disabled'],
            schema:{
              $ref:"#/definitions/CustomStatusQuery"
            }
          } 
          #swagger.parameters['ratings'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：評分列表',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomGetCommentsRatingsQuery"
            }
          } 
          #swagger.parameters['createdAtFrom'] = {
            in: 'query',
            required: false,
            description: '評論時間 - 起',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomTimeAtFromQuery"
            }
          } 
          #swagger.parameters['createdAtTo'] = {
            in: 'query',
            required: false,
            description: '評論時間 - 迄',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomTimeAtToQuery"
            }
          } 
          #swagger.parameters['productName'] = {
            in: 'query',
            required: false,
            description: '模糊搜尋：商品名稱 (Admin 專用)，不能和 ProductIds 同時使用',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomGetProductTitleQuery"
            }
          } 
          #swagger.parameters['productIds'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：商品 id 列表，不能和 ProductName 同時使用，非使用者一定要使用該 query',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomGetCommentsProductIdsQuery"
            }
          } 
          #swagger.parameters['accounts'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：帳號列表 (Admin 專用)',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomGetCommentsProductIdsQuery"
            }
          } 
          #swagger.parameters['sortBy'] = {
            in: 'query',
            required: true,
            description: '排序根據，降冪則在前面加上 -',
            type: 'string',
            enum: ["rating", "createdAt", "account", "productName", "productId"],
            schema:{
              $ref: "#/definitions/CustomSortByQuery"
            }
          }
          #swagger.parameters['content'] = {
            in: 'query',
            required: false,
            description: '模糊搜尋：評論內容 (Admin 專用)',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetCommentsContentQuery"
            }
          }
       */
      /*
        #swagger.responses[200] = {
            description:'OK',
            schema:{
              $ref: "#/definitions/GetCommentsSuccess"
            }
          }
      */
      UserCheck,
      this.usePipe(GetCommentsPipe),
      this.responseHandler(this.controller.getComments),
    );

    this.router.post(
      '/v1/comment',
      /**
       * #swagger.tags = ['Comment']
       * #swagger.summary = '對商品評論'
       */
      /*
        #swagger.parameters['obj'] = {
          in:'body',
          description:'要被建立的評論',
          schema: {
            $ref: '#/definitions/CustomCreateCommentObj'
          }
        }
       */
      /*
        #swagger.responses[200] = {
            description:'OK',
            schema:{
              $ref: "#/definitions/CreateCommentSuccess"
            }
          }
      */
      UserVerify,
      this.usePipe(CreateCommentPipe),
      this.responseHandler(this.controller.commentProduct),
    );

    this.router.delete(
      '/v1/comment',
      /**
       * #swagger.tags = ['Admin']
       * #swagger.summary = '批次刪除評論'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
          #swagger.parameters['obj'] = {
            in: 'body',
            description: '欲刪除的評論 id 列表',
            schema: {
              $ref:"#/definitions/CustomDeleteCommentsObj"
            }
          }
       */
      /*
          #swagger.responses[200] = {
            description:'OK',
            schema:{
              $ref: "#/definitions/DeleteSuccess"
            }
          }
       */
      UserVerify,
      IsAdmin,
      this.usePipe(DeleteCommentsPipe),
      this.responseHandler(this.controller.deleteComments),
    );
  }
}
