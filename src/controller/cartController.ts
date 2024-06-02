import { EditCartProductDTO } from '../dto/cart/editCartProductDto';
import { GetCartDTO } from '../dto/cart/getCartDto';
import { CartService } from '../service/cartService';
import { IEditCartProductReq, IGetCartReq } from '../types/cart.type';
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
