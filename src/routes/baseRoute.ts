import { Request, Response, NextFunction, Router } from 'express';
import { ResponseObject } from '../utils/responseObject';
import { BaseController } from '../controller/baseController';
import { HttpStatus } from '../types/responseType';
import log4js from '../config/log4js';
const logger = log4js.getLogger(`BaseRoute`);

export abstract class BaseRoute {
  public router = Router();
  protected controller!: BaseController;

  protected abstract setRouters(): void;

  protected prefix: string = '/api';

  protected constructor() {
    this.initial();
  }

  protected initial(): void {
    this.setRouters();
  }

  public getRouters() {
    return this.router;
  }

  public getPrefix() {
    return this.prefix;
  }

  protected responseHandler(
    method: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<ResponseObject>,
    controller = this.controller,
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      method
        .call(this.controller, req, res, next)
        .then((obj) => res.status(HttpStatus.OK).json(obj))
        .catch((err) => {
          logger.error(err);
          next(controller.formatResponse(err.message, (err as any).status));
        });
    };
  }
}
