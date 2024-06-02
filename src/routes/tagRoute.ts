import { TagController } from '../controller/tagController';
import { IsAdmin } from '../middleware/isAdmin';
import { UserVerify } from '../middleware/userVerify';
import { CreateTagPipe } from '../validator/tag/createTag.pipe';
import { GetTagsPipe } from '../validator/tag/getTags.pipe';
import { BaseRoute } from './baseRoute';

export class TagRoute extends BaseRoute {
  protected controller!: TagController;

  constructor() {
    super();
    this.initial();
  }

  protected initial = () => {
    this.controller = new TagController();
    this.setRouters();
  };

  protected setRouters() {
    this.router.get(
      '/v1/tag',
      /**
       * #swagger.tags = ['Tag']
       * #swagger.summary = '取得標籤列表'
       */
      /*
        #swagger.parameters['page'] = {
          in: 'query',
          required: true,
          description: '頁數',
          type: 'string',
          schema:{
            $ref: "#/definitions/CustomPageQuery"
          }
        }
        #swagger.parameters['limit'] = {
          in: 'query',
          required: true,
          description: '每頁資料數',
          type: 'string',
          schema:{
            $ref: "#/definitions/CustomLimitQuery"
          }
        }
        #swagger.parameters['name'] ={
          in: 'query',
          required: false,
          description: '模糊搜尋：標籤名稱',
          type:'string',
          schema:{
            $ref: "#/definitions/CustomTagNameQuery"
          }
        }
       */
      /*
          #swagger.responses[200] = {
            description:'OK',
            schema:{
              $ref: "#/definitions/GetProductsSuccess"
            }
          }
      */
      this.usePipe(GetTagsPipe),
      this.responseHandler(this.controller.getTags),
    );
    this.router.post(
      '/v1/tag',
      /**
       * #swagger.tags = ['Admin']
       * #swagger.summary = '新增標籤'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['obj'] ={
          in:'body',
          description:'欲新增的標籤',
          schema:{
            $ref:"#/definitions/CustomCreateTagObj"
          }
        } 
       */
      /**
        #swagger.responses[200]={
          description:'OK',
          schema:{
            $ref:'#/definitions/CreateTagSuccess'
          }
        }
       */
      UserVerify,
      IsAdmin,
      this.usePipe(CreateTagPipe),
      this.responseHandler(this.controller.createTag),
    );

    this.router.patch(
      '/v1/tag/:tagId',
      /**
       * #swagger.tags = ['Admin']
       * #swagger.summary = '編輯標籤'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
        #swagger.parameters['tagId'] ={
          in:'path',
          description:'標籤ID',
          required: true,
          type: 'string'
       }
       */
      /*
        #swagger.parameters['obj'] ={
          in:'body',
          description:'欲編輯的標籤',
          schema:{
            $ref:"#/definitions/CustomCreateTagObj"
          }
        } 
       */
      /**
        #swagger.responses[200]={
          description:'OK',
          schema:{
            $ref:'#/definitions/CreateTagSuccess'
          }
        }
       */
      UserVerify,
      IsAdmin,
      this.usePipe(CreateTagPipe),
      this.responseHandler(this.controller.editTag),
    );

    this.router.delete(
      '/v1/tag/:tagId',
      /**
       * #swagger.tags = ['Admin']
       * #swagger.summary = '刪除標籤'
       * #swagger.security=[{"Bearer": []}]
       */
      /*
         #swagger.parameters['tagId'] ={
          in:'path',
          description:'標籤ID',
          required: true,
          type: 'string'
       }
       */
      /**
        #swagger.responses[200]={
          description:'OK',
          schema:{
            $ref:'#/definitions/CreateTagSuccess'
          }
        }
       */
      UserVerify,
      IsAdmin,
      this.responseHandler(this.controller.deleteTag),
    );
  }
}
