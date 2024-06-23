import { Router } from 'express';
import { HttpStatus } from '../types/responseType';
import log4js from '../config/log4js';
import { PipeBase } from '../validator/pipe.base';
import { IUserReq, TMethod } from '../types/common.type';
import { BaseController } from '../controller/baseController';

const logger = log4js.getLogger(`BaseRoute`);

type TResponseHandler = (
  method: TMethod,
  controller?: BaseController,
) => TMethod<IUserReq, void>;

export abstract class BaseRoute {
  public router = Router();
  protected controller!: BaseController;

  protected abstract setRouters(): void;

  protected prefix: string = '/api';

  protected constructor() {}

  public getRouters() {
    return this.router;
  }

  public getPrefix() {
    return this.prefix;
  }

  protected usePipe<T extends PipeBase>(prototype: new () => T) {
    const pipe = new prototype();
    return pipe.transform();
  }

  protected responseHandler: TResponseHandler =
    (method, controller = this.controller) =>
    (req, res, next) => {
      method
        .call(this.controller, req, res, next)
        .then((obj) => {
          const isRedirect = !!(
            obj.data &&
            (obj.data as { specific_redirect_url?: string })
              .specific_redirect_url
          );
          if (isRedirect) {
            const { specific_redirect_url } = obj.data as {
              specific_redirect_url: string;
            };
            res
              .status(HttpStatus.MOVED_PERMANENTLY)
              .redirect(specific_redirect_url);
          } else {
            res.status(HttpStatus.OK).json(obj);
          }
        })
        .catch((err) => {
          logger.error(err);
          next(controller.formatResponse(err.message, err.status));
        });
    };
}
