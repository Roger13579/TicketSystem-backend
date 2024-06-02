import { BaseRoute } from './baseRoute';
import { GroupController } from '../controller/groupController';
import { UserCheck, UserVerify } from '../middleware/userVerify';
import { CreateGroupPipe } from '../validator/group/createGroup.pipe';
import { UpdateGroupPipe } from '../validator/group/updateGroup.pipe';
import { JoinGroupPipe } from '../validator/group/joinGroup.pipe';
import { GetGroupsPipe } from '../validator/group/getGroup.pipe';

export class GroupRoute extends BaseRoute {
  protected controller!: GroupController;

  constructor() {
    super();
    this.initial();
  }

  protected initial(): void {
    this.controller = new GroupController();
    this.setRouters();
  }

  protected setRouters(): void {
    this.router.post(
      '/v1/group',
      /**
       * #swagger.tags = ['Group']
       * #swagger.summary = '建立揪團'
       * #swagger.security=[{"Bearer": []}],
       */
      /*
          #swagger.parameters['obj'] ={
            in:'body',
            description:'欲建立的揪團資料',
            schema:{
              $ref:"#/definitions/CustomCreateGroupObj"
            }
       }
       */
      /**
       #swagger.responses[200] = {
       description: 'OK',
       schema: {
       $ref: '#/definitions/CreateGroupSuccess' }
       }
       */
      UserVerify,
      this.usePipe(CreateGroupPipe),
      this.responseHandler(this.controller.createGroup),
    );
    this.router.patch(
      '/v1/group/:groupId',
      /**
       * #swagger.tags = ['Group']
       * #swagger.summary = '修改揪團'
       * #swagger.security=[{"Bearer": []}],
       */
      /*
       #swagger.parameters['groupId'] ={
          in:'path',
          description:'揪團ID',
          required: true,
          type: 'string'
       }
       #swagger.parameters['obj'] ={
         in:'body',
         description:'欲修改的揪團資料',
         schema:{
           $ref:"#/definitions/CustomUpdateGroupObj"
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
      this.usePipe(UpdateGroupPipe),
      this.responseHandler(this.controller.updateGroup),
    );
    this.router.patch(
      '/v1/group/join/:groupId',
      /**
       * #swagger.tags = ['Group']
       * #swagger.summary = '參加揪團'
       * #swagger.security=[{"Bearer": []}],
       */
      /*
      #swagger.parameters['groupId'] ={
          in:'path',
          description:'揪團ID',
          required: true,
          type: 'string'
       }
       #swagger.parameters['obj'] ={
         in:'body',
         description:'參加揪團的資料',
         schema:{
           $ref:"#/definitions/CustomJoinGroupObj"
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
      this.usePipe(JoinGroupPipe),
      this.responseHandler(this.controller.joinGroup),
    );
    this.router.patch(
      '/v1/group/leave/:groupId',
      /**
       * #swagger.tags = ['Group']
       * #swagger.summary = '退出揪團'
       * #swagger.security=[{"Bearer": []}],
       */
      /*
       #swagger.parameters['groupId'] ={
          in:'path',
          description:'揪團ID',
          required: true,
          type: 'string'
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
      this.responseHandler(this.controller.leaveGroup),
    );
    this.router.delete(
      '/v1/group/:groupId',
      /**
       * #swagger.tags = ['Group']
       * #swagger.summary = '刪除揪團'
       * #swagger.security=[{"Bearer": []}],
       */
      /*
       #swagger.parameters['groupId'] ={
          in:'path',
          description:'揪團ID',
          required: true,
          type: 'string'
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
      this.responseHandler(this.controller.deleteGroup),
    );
    this.router.get(
      '/v1/group',
      /**
       * #swagger.tags = ['Group']
       * #swagger.summary = '取得揪團列表'
       * #swagger.security=[{"Bearer": []}],
       */
      /*  #swagger.parameters['title'] = {
            in: 'query',
            required: false,
            description: '模糊搜尋：揪團名稱',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomGetGroupTitleQuery"
            }
          }
          #swagger.parameters['movieTitle'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：電影名稱',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetGroupMovieTitleQuery"
            }
          }
          #swagger.parameters['status'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：揪團狀態',
            enum:['ongoing', 'cancelled', 'completed'],
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetGroupStatusQuery"
            }
          }
          #swagger.parameters['participantCount'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：開團人數',
            type: 'number',
            schema:{
              $ref: "#/definitions/CustomGetGroupCountQuery"
            }
          }
          #swagger.parameters['hasTicket'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：是否持有票券',
            type: 'boolean',
            enum:['true','false'],
            schema:{
              $ref: "#/definitions/CustomGetGroupHasTicketQuery"
            }
          }
          #swagger.parameters['startAt'] = {
            in: 'query',
            required: false,
            description: '開始活動時間-起',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomTimeAtFromQuery"
            }
          }
          #swagger.parameters['endAt'] = {
            in: 'query',
            required: false,
            description: '開始活動時間-迄',
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
            required: true,
            description: '每頁資料數',
            type: 'number',
            schema:{
              $ref: "#/definitions/CustomLimitQuery"
            }
          }
          #swagger.parameters['sortBy'] = {
            in: 'query',
            required: true,
            description: '排序根據，降冪則在前面加上 - ',
            type: 'string',
            enum:['startAt', 'title'],
            schema:{
              $ref: "#/definitions/CustomSortByQuery"
            }
          }
      */
      /*
          #swagger.responses[200] = {
            description:'OK',
            schema:{
              $ref: "#/definitions/GetGroupsSuccess"
            }
          }
      */
      UserCheck,
      this.usePipe(GetGroupsPipe),
      this.responseHandler(this.controller.getGroups),
    );
  }
}
