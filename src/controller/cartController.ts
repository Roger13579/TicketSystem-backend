import { DeleteItemDTO } from '../dto/cart/deleteItemDto';
import { EditCartDTO } from '../dto/cart/editCartDto';
import { GetCartDTO } from '../dto/cart/getCartDto';
import { CartService } from '../service/cartService';
import {
  DeleteCartType,
  IDeleteCartReq,
  IEditCartReq,
  IGetCartReq,
} from '../types/cart.type';
import { CustomResponseType } from '../types/customResponseType';
import { EditCartVo } from '../vo/cart/editCartVo';
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

  public readonly deleteItem = async (req: IDeleteCartReq) => {
    const deleteItemDto = new DeleteItemDTO(req);

    const { type, userId } = deleteItemDto;

    if (type === DeleteCartType.all) {
      await this.cartService.clearCart(userId);
      return this.formatResponse(
        CustomResponseType.OK_MESSAGE,
        CustomResponseType.OK,
        { items: [], errors: [] },
      );
    }

    const carts = await this.cartService.deleteItem(deleteItemDto);

    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new EditCartVo(carts),
    );
  };

  public readonly editCart = async (req: IEditCartReq) => {
    const editCartDto = new EditCartDTO(req);
    const carts = await this.cartService.editCart(editCartDto);
    return this.formatResponse(
      CustomResponseType.OK_MESSAGE,
      CustomResponseType.OK,
      new EditCartVo(carts),
    );
  };
}
