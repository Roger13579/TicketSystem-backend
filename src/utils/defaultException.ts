import { ErrorRequestHandler } from 'express';
import log4js from '../config/log4js';
const logger = log4js.getLogger(`DefaultException`);

export const DefaultException: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err);
  err.statusCode = err.statusCode || 500;
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    data: err.data || {},
  });
};
