import { NextFunction, Request, Response } from 'express';
import user from '../models/user';
import UserModel from '../models/user';
import log4js from '../config/log4js';
import { AppError } from '../utils/errorHandler';
const logger = log4js.getLogger(`UserController`);

class UserController {
  public async createUser(req: Request, res: Response, next: NextFunction) {
    const { name, account, pwd } = req.body;
    await user
      .create(
        new UserModel({
          name,
          account,
          pwd,
        }),
      )
      .then(() => {
        logger.info('user create success');
        res.status(200).json({
          name,
        });
      })
      .catch((err) => {
        logger.error('user create fail', err);
        next(new AppError(500, 'validation fail', err.message));
      });
  }
}

export default UserController;
