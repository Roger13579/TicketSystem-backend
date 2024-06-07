import UploadController from '../controller/uploadController';
import { UserVerify } from '../middleware/userVerify';
import { uploadFile } from '../utils/upload';
import { UploadFilePipe } from '../validator/upload/uploadFile.pipe';
import { BaseRoute } from './baseRoute';

export class UploadRoute extends BaseRoute {
  protected controller!: UploadController;

  constructor() {
    super();
    this.initial();
  }

  protected initial() {
    this.controller = new UploadController();
    this.setRouters();
  }

  protected setRouters() {
    this.router.post(
      '/v1/uploadFile/:type/:category',
      /**
       * #swagger.tags= ['Upload']
       * #swagger.summary = '上傳檔案'
       *  #swagger.security=[{"Bearer": []}],
       */

      /*  #swagger.parameters['type'] = {
            in: 'path',
            required: true,
            description: '上傳種類，e.g. photo',
            type: 'string',
          }
          #swagger.parameters['category'] = {
            in: 'path',
            required: true,
            description: '上傳類型，e.g. user / product',
            type: 'string',
        }
      */
      /*
         #swagger.responses[200] = {
          description: 'OK',
          schema: {
            $ref: '#/definitions/UploadFileSuccess' }
         }
      */
      UserVerify,
      this.usePipe(UploadFilePipe),
      uploadFile,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this.responseHandler(this.controller.uploadFile),
    );
  }
}
