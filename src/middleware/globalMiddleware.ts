import log4js from '../config/log4js';
import { IUserReq, TMethod } from '../types/common.type';
const logger = log4js.getLogger(`globalMiddleware`);
export const globalMiddleware: TMethod<IUserReq, void> = (req, res, next) => {
  logger.info(`request method : ${req.method}`);
  logger.info(`request uri : ${req.url}`);
  logger.info(`request from : ${req.ip}`);
  next();
};
