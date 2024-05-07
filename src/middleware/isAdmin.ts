import { Request, Response, NextFunction } from 'express';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';

export const IsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accountType = (req.user as any).accountType;
  if (accountType !== 'admin') {
    throwError(
      CustomResponseType.PERMISSION_DENIED_MESSAGE,
      CustomResponseType.PERMISSION_DENIED,
    );
  }
  return next();
};
