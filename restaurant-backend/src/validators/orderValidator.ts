import { Address } from '../models/AddressModel';
import { Dish } from '../models/DishModel';
import Cart from '../models/CartModel';
import { Request } from 'express';


class OrderValidator {

  static validatePlaceOrder(req: Request) {
    const { address_id, address, payment_method, delivery_type, items, order_type, delivery_time_type, scheduled_time, note } = req.body;

    if (delivery_type === 'PICKUP' && address_id === '') {
      req.body.address_id = undefined; 
    }
  
    if (delivery_type === 'DELIVERY') {
      if (!address_id || address_id === '') {
        return { valid: false, message: 'address_id is required for DELIVERY orders.' };
      }
    }

    if (!Array.isArray(items) || items.length === 0) {
      return { valid: false, message: 'Items are required and must be an array.' };
    }
    
    for (let item of items) {
      if (!item.dish_id || !item.quantity) {
        return { valid: false, message: 'Each item must have a dish_id and quantity.' };
      }
    }

    if (delivery_time_type === 'SCHEDULED' && !scheduled_time) {
      return { valid: false, message: 'Scheduled time is required for scheduled deliveries.' };
    }

    if (scheduled_time) {
      const scheduledDate = new Date(scheduled_time);
      if (isNaN(scheduledDate.getTime())) {
        return { valid: false, message: 'Invalid scheduled time format. Use ISO format (e.g. 2023-09-25T15:30:00Z).' };
      }
      
      if (scheduledDate < new Date()) {
        return { valid: false, message: 'Scheduled time cannot be in the past.' };
      }
    }

    if (!['CASH', 'BANKING', 'VNPAY', 'MOMO', 'CREDIT_CARD'].includes(payment_method)) {
      return { valid: false, message: 'Invalid payment method.' };
    }

    if (!['DELIVERY', 'PICKUP'].includes(delivery_type)) {
      return { valid: false, message: 'Invalid delivery type.' };
    }

    if (!['DINE_IN', 'ONLINE'].includes(order_type)) {
      return { valid: false, message: 'Invalid order type.' };
    }

    if (note && typeof note !== 'string') {
      return { valid: false, message: 'Note must be a string.' };
    }

    return { valid: true };
  }

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

      if(dish.status !== 'available') {
        throw new Error(`Dish "${dish.name}" is not available`);
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
        note: clientItem.note || null,
      });

    }


    return { orderItems, totalAmount };
  }


}

export default OrderValidator;
