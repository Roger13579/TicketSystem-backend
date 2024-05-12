import { BaseRoute } from './baseRoute';
import { GroupController } from '../controller/groupController';
import { UserVerify } from '../middleware/userVerify';
import { CreateGroupPipe } from '../validator/group/createGroup.pipe';

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
  }
}
