import mongoose from 'mongoose';
import { Dish } from '../models/DishModel';
import Cart from '../models/CartModel';

class CartService {
  static async UpdateCart(id: string, dishId: string, quantity: number) {
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(dishId)) {
      throw new Error('Invalid cartId or dishId');
    }

    const cart = await Cart.findById(id);
    if (!cart) {
      throw new Error('Cart not found');
    }
 
    const dish = await Dish.findById(dishId);
    if (!dish) {
      throw new Error('Dish does not exist');
    }
    if (dish.status !== 'available') {
      throw new Error('Dish is not available for purchase');
    }

    const existingItem = cart.items.find((item) => item.dishId.toString() === dishId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > dish.countInStock) {
        throw new Error('Adding more exceeds available stock');
      }

      if (newQuantity > 0) {
        existingItem.quantity = newQuantity;
      } else {
        cart.items = cart.items.filter((item) => item.dishId.toString() !== dishId);
      }
    } else {
      if (quantity <= 0) {
        throw new Error('Cannot decrease item that does not exist in cart');
      }
      cart.items.push({
        dishId: new mongoose.Types.ObjectId(dishId),
        quantity,
        price: dish.price,
      });
    }

    // Cập nhật lại tổng tiền
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();
    return cart;
  }

  static async DeleteCartItem(cartId: string, dishId: string) {
    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(dishId)) {
      throw new Error('Invalid cartId or dishId');
    }
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    if (cart.items.length === 0) {
      throw new Error('Cart is already empty');
    }
    const itemIndex = cart.items.findIndex((item) => item.dishId.toString() === dishId);
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }
    cart.items.splice(itemIndex, 1);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();
    return cart;
  }

  static async DeleteAllCart(cartId: string) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      throw new Error('Invalid cartId');
    }
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    return cart;
  }
}

export default CartService;
