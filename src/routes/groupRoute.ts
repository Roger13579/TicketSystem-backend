import { BaseRoute } from './baseRoute';
import { GroupController } from '../controller/groupController';
import { UserVerify } from '../middleware/userVerify';
import { CreateGroupPipe } from '../validator/group/createGroup.pipe';
import { UpdateGroupPipe } from '../validator/group/updateGroup.pipe';
import { JoinGroupPipe } from '../validator/group/joinGroup.pipe';

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
       */
      /*
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
  }
}
