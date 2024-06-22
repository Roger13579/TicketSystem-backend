import jwt, { JwtPayload } from 'jsonwebtoken';
import { CustomResponseType } from '../types/customResponseType';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repository/userRepository';
import { throwError } from '../utils/errorHandler';
import { UserDetailDto } from '../dto/user/userDetailDto';
import { IUser } from '../models/user';
import { mailer } from '../utils/mailer';
import log4js from '../config/log4js';
import { ResetPwdDto } from '../dto/user/resetPwdDto';
import passport from 'passport';
import { GoogleProfileDto } from '../dto/user/googleProfileDto';
import { FavoriteItem, TGoogleUser, ThirdPartyType } from '../types/user.type';
import { EditFavoriteDTO } from '../dto/user/editFavoriteDto';
import { GetUserFavoriteDTO } from '../dto/user/getUserFavoriteDto';
import { ProductRepository } from '../repository/productRepository';
import { IUserReq, TMethod } from '../types/common.type';
import { SignUpDTO } from '../dto/user/signUpDto';
import { GoogleSignUpDTO } from '../dto/user/googleSignUpdDto';
import { SellTicketDto } from '../dto/ticket/sellTicketDto';
import { TicketRepository } from '../repository/ticketRepository';
import { ITicket } from '../models/ticket';
import {
  PaginateDocument,
  PaginateOptions,
  PaginateResult,
  Types,
} from 'mongoose';
import { IProduct } from '../models/product';
import { GetTransferableTicketVo } from '../vo/ticket/getTransferableTicketVo';
import { GroupRepository } from '../repository/groupRepository';
import { GroupDocument, IGroupId } from '../types/group.type';
import { GetUserGroupDto } from '../dto/group/getUserGroupDto';
import { IGroup } from '../models/group';

const logger = log4js.getLogger(`UserService`);

export class UserService {
  private readonly userRepository: UserRepository = new UserRepository();

  private readonly productRepository: ProductRepository =
    new ProductRepository();

  private readonly ticketRepository: TicketRepository = new TicketRepository();
  private readonly groupRepository: GroupRepository = new GroupRepository();

  public async createUser({ pwd, email, account }: SignUpDTO) {
    const hashPwd = bcrypt.hashSync(pwd, 10);
    const findByEmail = await this.userRepository.findByEmail(email);
    const findByAccount = await this.userRepository.findByAccount(account);
    if (findByEmail) {
      throwError(
        CustomResponseType.EMAIL_REGISTERED_MESSAGE + email,
        CustomResponseType.EMAIL_REGISTERED,
      );
    } else if (findByAccount) {
      throwError(
        CustomResponseType.ACCOUNT_REGISTERED_MESSAGE + account,
        CustomResponseType.ACCOUNT_REGISTERED,
      );
    }
    return this.userRepository
      .createUser(account, email, hashPwd)
      .catch((err) => {
        logger.error('create user error', err);
        throwError(
          CustomResponseType.INSERT_ERROR_MESSAGE,
          CustomResponseType.INSERT_ERROR,
        );
      });
  }

  public async updateUserDetail(userDetailDto: UserDetailDto) {
    return this.userRepository.updateUserDetail(userDetailDto).catch((err) => {
      logger.error('update user detail error', err);
      throwError(
        CustomResponseType.UPDATE_ERROR_MESSAGE,
        CustomResponseType.UPDATE_ERROR,
      );
    });
  }

  public async updateUserFromGoogle({
    pwd,
    account,
    thirdPartyId,
  }: GoogleSignUpDTO) {
    const hashPwd = bcrypt.hashSync(pwd, 10);
    return this.userRepository
      .updateUserFromGoogle(account, hashPwd, thirdPartyId)
      .catch((err) => {
        logger.error('update google user detail error', err);
        throwError(
          CustomResponseType.UPDATE_ERROR_MESSAGE,
          CustomResponseType.UPDATE_ERROR,
        );
      });
  }

  public async findByAccount(account: string) {
    const user = (await this.userRepository.findByAccount(account)) as IUser;
    if (!user) {
      throwError(
        CustomResponseType.UNREGISTERED_USER_MESSAGE,
        CustomResponseType.UNREGISTERED_USER,
      );
    }
    return user;
  }

  public async getUserGroups(getUserGroupDto: GetUserGroupDto) {
    switch (getUserGroupDto.groupType) {
      case 'own': {
        const ownResult = await this.groupRepository.findByUserId(
          getUserGroupDto.ownFilter,
          getUserGroupDto.ownOptions,
        );
        return this.addVacancy(ownResult);
      }
      case 'joined': {
        const groupIds =
          getUserGroupDto.user.groups !== undefined
            ? getUserGroupDto.user.groups
            : ([] as IGroupId[]);
        const joinedResult = await this.groupRepository.findByIds(
          groupIds.map((id) => id.groupId.toString()),
          getUserGroupDto.joinedOptions,
        );
        return this.addVacancy(joinedResult);
      }
    }
  }

  public async forgotPwd(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throwError(
        CustomResponseType.EMAIL_VERIFICATION_FAILED_MESSAGE,
        CustomResponseType.EMAIL_VERIFICATION_FAILED,
      );
    } else {
      await mailer(
        user,
        await this.generateForgotPasswordJWT(user.id.toString()),
      );
    }
  }
  public async refreshToken(token: string) {
    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRETS) as JwtPayload;
      const user = await this.userRepository.findById(payload.id);
      if (user) {
        return jwt.sign(
          { id: user.id.toString(), accountType: user.accountType },
          process.env.JWT_SECRETS,
          Object.assign({ expiresIn: process.env.JWT_EXPIRES }),
        );
      } else {
        throw new Error();
      }
    } catch (err) {
      throwError(
        CustomResponseType.TOKEN_EXPIRED_MESSAGE,
        CustomResponseType.TOKEN_EXPIRED,
      );
    }
  }

  public async resetPwd(resetPwdDto: ResetPwdDto) {
    const user = await this.userRepository.findById(resetPwdDto.getId);
    if (!user) {
      throwError(
        CustomResponseType.EMAIL_VERIFICATION_FAILED_MESSAGE,
        CustomResponseType.EMAIL_VERIFICATION_FAILED,
      );
    } else {
      const dbPwd: string = user.pwd;
      if (resetPwdDto.getOldPwd) {
        const oldCompare = await bcrypt.compare(resetPwdDto.getOldPwd, dbPwd);
        if (!oldCompare) {
          return throwError(
            CustomResponseType.OLD_PASSWORD_INCORRECT_MESSAGE,
            CustomResponseType.OLD_PASSWORD_INCORRECT,
          );
        }
      }
      const compare: boolean = await bcrypt.compare(resetPwdDto.getPwd, dbPwd);
      if (compare) {
        return throwError(
          CustomResponseType.CAN_NOT_USE_OLD_PASSWORD_MESSAGE,
          CustomResponseType.CAN_NOT_USE_OLD_PASSWORD,
        );
      }
      const newPwd = bcrypt.hashSync(resetPwdDto.getPwd, 10);
      return await this.userRepository
        .updatePwd(resetPwdDto.getId, newPwd)
        .catch((err) => {
          logger.error('reset pwd error', err);
          throwError(
            CustomResponseType.UPDATE_ERROR_MESSAGE,
            CustomResponseType.UPDATE_ERROR,
          );
        });
    }
  }

  public generateJWT(
    userId: string,
    accountType: string,
  ): { accessToken: string; refreshToken: string } {
    const privateKey = process.env.JWT_SECRETS;
    const defaultOptions: object = {
      expiresIn: process.env.JWT_EXPIRES,
    };
    const refreshOptions: object = {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    };
    const accessToken = jwt.sign(
      { id: userId, accountType: accountType },
      privateKey,
      Object.assign(defaultOptions),
    );

    const refreshToken = jwt.sign(
      { id: userId, accountType: accountType },
      privateKey,
      Object.assign(refreshOptions),
    );
    return { accessToken, refreshToken };
  }
  public generateRefreshJWT(userId: string, accountType: string): string {
    const privateKey = process.env.JWT_SECRETS;
    const defaultOptions: object = {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    };
    return jwt.sign(
      { id: userId, accountType: accountType },
      privateKey,
      Object.assign(defaultOptions),
    );
  }

  public async generateForgotPasswordJWT(userId: string) {
    const privateKey = process.env.JWT_SECRETS;
    const defaultOptions: object = {
      expiresIn: process.env.JWT_EMAIL_EXPIRES,
    };
    return jwt.sign({ id: userId }, privateKey, Object.assign(defaultOptions));
  }

  public googleAuth: TMethod<IUserReq, Promise<IUser | void>> = async (
    req,
    res,
    next,
  ) => {
    const authenticate = (): Promise<GoogleProfileDto> =>
      new Promise((resolve) => {
        passport.authenticate(
          ThirdPartyType.google,
          { session: false },
          (error: Error, user: TGoogleUser) => {
            if (error || !user) {
              logger.error(error);
              throwError(
                CustomResponseType.GOOGLE_AUTH_ERROR_MESSAGE,
                CustomResponseType.GOOGLE_AUTH_ERROR,
              );
            }
            resolve(new GoogleProfileDto(user));
          },
        )(req, res, next);
      });

    const googleUser: GoogleProfileDto = await authenticate();
    const user = await this.userRepository.findByThirdPartyId(googleUser.getId);
    if (!user) {
      return this.userRepository.createUserByGoogle(googleUser).catch((err) => {
        logger.error('create user error', err);
        throwError(
          CustomResponseType.INSERT_ERROR_MESSAGE,
          CustomResponseType.INSERT_ERROR,
        );
      });
    } else {
      return user;
    }
  };

  public getFavorite = async (getUserFavoriteDto: GetUserFavoriteDTO) => {
    const result =
      await this.userRepository.findFavoriteByUserId(getUserFavoriteDto);
    result.favorites.forEach((favorite: FavoriteItem) => {
      favorite.isFavorite = true;
    });
    return result;
  };

  public addFavorite = async (editFavoriteDto: EditFavoriteDTO) => {
    const { productId } = editFavoriteDto;
    const availableProduct = await this.productRepository.findProduct({
      _id: productId,
      isPublic: true,
    });

    if (!availableProduct) {
      throwError(
        CustomResponseType.EDIT_FAVORITE_ERROR_MESSAGE + '該商品無法被收藏',
        CustomResponseType.EDIT_FAVORITE_ERROR,
      );
      return null;
    }

    const favorite = await this.userRepository.addFavorite(editFavoriteDto);

    if (!favorite) {
      throwError(
        CustomResponseType.EDIT_FAVORITE_ERROR_MESSAGE + '該商品已被收藏',
        CustomResponseType.EDIT_FAVORITE_ERROR,
      );
      return null;
    }

    return favorite;
  };

  public deleteFavorite = async (editFavoriteDto: EditFavoriteDTO) => {
    const favorite = await this.userRepository.deleteFavorite(editFavoriteDto);
    if (!favorite) {
      throwError(
        CustomResponseType.EDIT_FAVORITE_ERROR_MESSAGE +
          '該商品不存在於收藏列表',
        CustomResponseType.EDIT_FAVORITE_ERROR,
      );
      return null;
    }
    return favorite;
  };

  public sellTicket = async (sellTicketDto: SellTicketDto) => {
    const tickets =
      await this.ticketRepository.findTransferableTicketByOrderIdAndProductId(
        sellTicketDto.userId,
        sellTicketDto.orderId,
        sellTicketDto.productId,
      );
    if (!tickets) {
      throwError(
        CustomResponseType.TICKET_NOT_FOUND_MESSAGE,
        CustomResponseType.TICKET_NOT_FOUND,
      );
    }
    if (tickets.length < sellTicketDto.sellAmount) {
      throwError(
        CustomResponseType.TICKET_NOT_ENOUGH_MESSAGE,
        CustomResponseType.TICKET_NOT_ENOUGH,
      );
    }
    return await this.ticketRepository.updateSellTickets(
      tickets.splice(0, sellTicketDto.sellAmount),
    );
  };
  public getTransferableTicket = async (userId: string) => {
    const tickets = await this.ticketRepository.findTransferableTicket(userId);
    // 查出的ticket依orderId和productId分組
    const grouped = tickets.reduce(
      (acc, ticket) => {
        const key = `${ticket.orderId}-${ticket.productId}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(ticket);
        return acc;
      },
      {} as { [key: string]: ITicket[] },
    );
    // 去除只剩一張的票
    const validGroups = Object.values(grouped).filter(
      (group) => group.length > 1,
    );
    // 依productId查出商品資訊
    const map = Object.values(validGroups).map(async (group) => {
      const product = (await this.productRepository.findById(
        new Types.ObjectId(group[0].productId),
      )) as IProduct;
      return new GetTransferableTicketVo(group, product);
    });
    return Promise.all(map);
  };
  private addVacancy(
    result: PaginateResult<
      PaginateDocument<
        IGroup,
        NonNullable<unknown>,
        PaginateOptions | undefined
      >
    >,
  ) {
    result.docs = result.docs.map((doc) => {
      const participants =
        doc.participant != undefined ? doc.participant.length : 0;
      const vacancy = doc.amount - participants;
      return {
        ...doc.toObject(),
        vacancy: vacancy,
      } as GroupDocument;
    });
    return result;
  }

  public useTicket = async (ticketId: string) => {
    const ticket = await this.ticketRepository.findById(
      new Types.ObjectId(ticketId),
    );
    if (!ticket) {
      throwError(
        CustomResponseType.TICKET_NOT_FOUND_MESSAGE,
        CustomResponseType.TICKET_NOT_FOUND,
      );
    }
    const privateKey = process.env.JWT_SECRETS;
    const defaultOptions: object = {
      expiresIn: '5m',
    };
    return jwt.sign(
      { ticketId: ticketId },
      privateKey,
      Object.assign(defaultOptions),
    );
  };
}
