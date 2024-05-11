import { BaseRoute } from './baseRoute';
import { GroupController } from '../controller/groupController';
import { UserVerify } from '../middleware/userVerify';
import { body } from 'express-validator';
import { CustomResponseType } from '../types/customResponseType';

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
      body('title')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '活動標題'),
      body('location')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '活動地點'),
      body('movieTitle')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '電影名稱'),
      body('time')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '活動時間'),
      body('amount')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '人數'),
      body('haveTicket')
        .exists()
        .withMessage(CustomResponseType.FORMAT_ERROR_MESSAGE + '是否持有票券'),
      this.responseHandler(this.controller.createGroup),
    );
  }
}
