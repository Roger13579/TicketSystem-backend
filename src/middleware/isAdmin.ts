import { Response, NextFunction } from 'express';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { IUserReq } from '../types/common.type';
import { IUser } from '../models/user';

export const IsAdmin = async (
  req: IUserReq,
  res: Response,
  next: NextFunction,
) => {
  const accountType = (req.user as IUser).accountType;
  if (accountType !== 'admin') {
    throwError(
      CustomResponseType.PERMISSION_DENIED_MESSAGE,
      CustomResponseType.PERMISSION_DENIED,
    );
  }
  return next();
};
