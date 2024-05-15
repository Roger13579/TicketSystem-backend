import { body } from 'express-validator';
import { PipeBase } from '../pipe.base';

export class DeleteProductsPipe extends PipeBase {
  public transform = () => [
    body('productIds')
      .exists()
      .withMessage('無效的商品 id 列表')
      .isArray()
      .isLength({ min: 1 }),
    body('productIds.*').exists().isString().withMessage('無效的商品 id 列表'),
    this.validationHandler,
  ];

  constructor() {
    super();
  }
}
