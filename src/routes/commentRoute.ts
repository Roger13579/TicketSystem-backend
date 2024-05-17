import { CommentController } from '../controller/commentController';
import { IsAdmin } from '../middleware/isAdmin';
import { UserVerify } from '../middleware/userVerify';
import { CreateCommentPipe } from '../validator/comment/createComment.pipe';
import { DeleteCommentsPipe } from '../validator/comment/deleteComments.pipe';
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
       * #swagger.tags = ['Comment']
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
