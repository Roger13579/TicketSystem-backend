import { AppError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';
import { IUserReq, TMethod } from '../types/common.type';
import { IUser } from '../models/user';
import { AccountType } from '../types/user.type';
import { HttpStatus } from '../types/responseType';

export const IsAdmin: TMethod<IUserReq, void> = async (req, res, next) => {
  const { accountType } = req.user as IUser;

  if (accountType !== AccountType.admin) {
    return next(
      new AppError(
        CustomResponseType.PERMISSION_DENIED_MESSAGE + '非管理者',
        HttpStatus.UNAUTHORIZED,
        CustomResponseType.PERMISSION_DENIED,
      ),
    );
  }
  return next();
};
