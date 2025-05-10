import { Address } from '../models/AddressModel';
import { Dish } from '../models/DishModel';
import Cart from '../models/CartModel';

class OrderValidator {
  static async validateAddress(address_id: string) {
    const address = await Address.findById(address_id);
    if (!address) {
      throw { statusCode: 400, message: 'Invalid address' };
    }
    return address;
  }

  static async validateCartAndItems(userId: string, clientItems: any[], session: any) {
    const cart = await Cart.findOne({ userId })
      .populate('items.dishId')
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw { statusCode: 400, message: 'Cart is empty' };
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const clientItem of clientItems) {
      const cartItem = cart.items.find(i => i.dishId._id.toString() === clientItem.dish_id);

      if (!cartItem) {
        throw new Error(`Dish ${clientItem.dish_id} not found in cart`);
      }

      if (clientItem.quantity !== cartItem.quantity) {
        throw new Error(`Mismatch quantity for ${clientItem.dishId}. Expected ${cartItem.quantity}, got ${clientItem.quantity}`);
      }

      const dish = await Dish.findById(cartItem.dishId._id);
      if (!dish) {
        throw new Error(`Dish not found: ${cartItem.dishId._id}`);
      }

      if (cartItem.quantity > dish.countInStock) {
        throw new Error(`Only ${dish.countInStock} portions left for "${dish.name}"`);
      }

      const unitPrice = dish.discount_price ?? dish.price;
      const itemTotal = unitPrice * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        dish_id: dish._id,
        dish_name: dish.name,
        unit_price: unitPrice,
        quantity: cartItem.quantity,
        total_amount: itemTotal,
        note: cartItem.note || null,
      });

    }


    return { orderItems, totalAmount };
  }


}

export default OrderValidator;
