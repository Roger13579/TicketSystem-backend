import { EditCartProductDTO } from '../dto/cart/editCartProductDto';
import { IUser } from '../models/user';
import { CartService } from '../service/cartService';
import { IEditCartProductReq } from '../types/cart.type';
import { IUserReq } from '../types/common.type';
import { CustomResponseType } from '../types/customResponseType';
import { BaseController } from './baseController';

export class CartController extends BaseController {
  private readonly cartService = new CartService();

  public readonly getCart = async (req: IUserReq) => {
    const { _id } = req.user as IUser;
    const cart = await this.cartService.getCart(_id);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { cart },
    );
  };

  public readonly editCartProduct = async (req: IEditCartProductReq) => {
    const editCartProductDto = new EditCartProductDTO(req);
    const updatedCart =
      await this.cartService.editCartProduct(editCartProductDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { cart: updatedCart },
    );
  };
}
