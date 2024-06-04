import { DeleteItemDTO } from '../dto/cart/deleteItemDto';
import { EditCartDTO } from '../dto/cart/editCartDto';
import { GetCartDTO } from '../dto/cart/getCartDto';
import { CartService } from '../service/cartService';
import { IEditCartReq, IGetCartReq } from '../types/cart.type';
import { IUserReq } from '../types/common.type';
import { CustomResponseType } from '../types/customResponseType';
import { GetCartVO } from '../vo/cart/getCartVo';
import { BaseController } from './baseController';

export class CartController extends BaseController {
  private readonly cartService = new CartService();

  public readonly getCart = async (req: IGetCartReq) => {
    const getCartDto = new GetCartDTO(req);
    const { limit, page } = getCartDto;
    const cart = await this.cartService.getCart(getCartDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new GetCartVO(cart, limit, page),
    );
  };

  public readonly deleteItem = async (req: IUserReq) => {
    const deleteItemDto = new DeleteItemDTO(req);
    const item = await this.cartService.deleteItem(deleteItemDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { item },
    );
  };

  public readonly editCart = async (req: IEditCartReq) => {
    const editCartDto = new EditCartDTO(req);
    const updatedCart = await this.cartService.editCart(editCartDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      { cart: updatedCart },
    );
  };
}
