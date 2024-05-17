import { CommentController } from '../controller/commentController';
import { UserVerify } from '../middleware/userVerify';
import { CreateCommentPipe } from '../validator/comment/createComment.pipe';
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
  }
}
