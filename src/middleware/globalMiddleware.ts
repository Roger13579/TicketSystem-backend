import { Request, Response, NextFunction } from 'express';
import log4js from '../config/log4js';
const logger = log4js.getLogger(`initConnection`);
const globalMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`request method : ${req.method}`);
  logger.info(`request uri : ${req.url}`);
  logger.info(`request from : ${req.ip}`);
  next();
};

export default globalMiddleware;
