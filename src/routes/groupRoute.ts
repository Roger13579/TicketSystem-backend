import { BaseRoute } from './baseRoute';
import { GroupController } from '../controller/groupController';
import { UserVerify } from '../middleware/userVerify';
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
      '/v1/group/:groupId',
      /**
       * #swagger.tags = ['Group']
       * #swagger.summary = '取得揪團詳細'
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
       $ref: '#/definitions/GetGroupDetailSuccess' }
       }
       */
      this.responseHandler(this.controller.getGroupDetail),
    );
    this.router.get(
      '/v1/group',
      /**
       * #swagger.tags = ['Group']
       * #swagger.summary = '取得揪團列表'
       */
      /*  
          #swagger.parameters['limit'] = {
            in: 'query',
            required: true,
            description: '每頁資料數 (1~100)',
            type: 'number',
            schema:{
              $ref: "#/definitions/CustomLimitQuery"
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
          #swagger.parameters['title'] = {
            in: 'query',
            required: false,
            description: '模糊搜尋：揪團名稱',
            type: 'string',
            schema:{
              $ref:"#/definitions/CustomGetGroupTitleQuery"
            }
          }
          #swagger.parameters['hasTicket'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：是否持有票券',
            type: 'boolean',
            enum:['true','false'],
            schema:{
              $ref: "#/definitions/CustomBooleanQuery"
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
          #swagger.parameters['theater'] = {
            in: 'query',
            required: false,
            description: '精準搜尋：電影院名稱',
            type: 'string',
            schema:{
              $ref: "#/definitions/CustomGetGroupTheaterQuery"
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
          #swagger.parameters['startDate'] = {
            in: 'query',
            required: false,
            description: '開始活動日期-起，一定要遵循以下格式，若要以時段搜尋則 startDate、endDate、startTime、endTime 皆為必填。',
            type: 'string',
            example: '2024/01/12'
          }
          #swagger.parameters['endDate'] = {
            in: 'query',
            required: false,
            description: '開始活動日期-迄，一定要遵循以下格式，若要以時段搜尋則 startDate、endDate、startTime、endTime 皆為必填。',
            type: 'string',
            example:'2024/07/12'
          }
          #swagger.parameters['startTime'] = {
            in: 'query',
            required: false,
            description: '開始活動時間-起，一定要遵循以下格式，若要以時段搜尋則 startDate、endDate、startTime、endTime 皆為必填。',
            type: 'string',
            example: '01:00'
          }
          #swagger.parameters['endTime'] = {
            in: 'query',
            required: false,
            description: '開始活動時間-迄，一定要遵循以下格式，若要以時段搜尋則 startDate、endDate、startTime、endTime 皆為必填。',
            type: 'string',
            example: '23:00'
          }
          #swagger.parameters['sortField'] = {
            in: 'query',
            required: false,
            description: '排序根據',
            type: 'string',
            enum:['startAt', 'title','createdAt','movieTitle','theater','id'],
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
              $ref: "#/definitions/GetGroupsSuccess"
            }
          }
      */
      this.usePipe(GetGroupsPipe),
      this.responseHandler(this.controller.getGroups),
    );
  }
}
