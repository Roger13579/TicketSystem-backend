import { NextFunction, Request, Response } from 'express';
import { BaseController } from './baseController';
import { ResponseObject } from '../utils/responseObject';
import { CustomResponseType } from '../types/customResponseType';

class IndexController extends BaseController {
  public index = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<ResponseObject> => {
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
    );
  };
}

export default IndexController;
