import { Types } from 'mongoose';
import { EditCartProductDTO } from '../dto/cart/editCartProductDto';
import { CartRepository } from '../repository/cartRepository';
import { throwError } from '../utils/errorHandler';
import { CustomResponseType } from '../types/customResponseType';

export class CartService {
  private readonly cartRepository: CartRepository = new CartRepository();

  public readonly getCart = async (userId: Types.ObjectId) => {
    const existedCart = await this.cartRepository.findCartByUserId(userId);

    if (existedCart) {
      return existedCart;
    }
    return await this.cartRepository.createCart(userId);
  };

  public readonly editCartProduct = async (
    editCartProductDto: EditCartProductDTO,
  ) => {
    const { productId, amount, userId } = editCartProductDto;

    const existedCart = await this.cartRepository.findCartByUserId(userId);

    // 數量為 0 ，購物車不存在 => 創建空購物車
    if (!existedCart && amount === 0) {
      return await this.cartRepository.createCart(userId);
    }

    // 購物車不存在，數量不為 0 => 創建新購物車並添加商品
    if (!existedCart) {
      await this.cartRepository.createCart(userId);
      return await this.cartRepository.addCartProduct(editCartProductDto);
    }

    // 購物車存在，檢查商品是否已存在於購物車中
    const existedItem = existedCart.items.find((item) =>
      item.productId?.equals(new Types.ObjectId(productId)),
    );

    // 商品已存在於購物車中，數量為 0 => 刪除商品
    if (!!existedItem && amount === 0) {
      return await this.cartRepository.deleteCartProduct(editCartProductDto);
    }

    // 商品已存在於購物車中，數量不為 0，舊數量和新數量不同 => 編輯商品
    if (!!existedItem && amount !== existedItem.amount) {
      return await this.cartRepository.editCartProduct(editCartProductDto);
    }

    // 商品已存在於購物車中，數量不為 0，舊數量和新數量相同 => 錯誤訊息
    if (!!existedItem && amount === existedItem.amount) {
      throwError(
        CustomResponseType.INVALID_EDIT_CART,
        CustomResponseType.INVALID_ADD_CART_MESSAGE +
          '該購物車商品數量相同，不須編輯',
      );
      return;
    }

    // 商品不存在於購物車中，數量為 0 => 錯誤訊息
    if (!existedItem && amount === 0) {
      throwError(
        CustomResponseType.INVALID_EDIT_CART,
        CustomResponseType.INVALID_ADD_CART_MESSAGE + '購物車內沒有該商品',
      );
      return;
    }

    // 商品不存在於購物車中，數量不為 0 => 則新增商品
    return await this.cartRepository.addCartProduct(editCartProductDto);
  };
}
