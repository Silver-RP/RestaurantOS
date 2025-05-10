import { Address } from '../models/AddressModel';
import { Dish } from '../models/DishModel';

class OrderValidator {
  static async validateAddress(address_id: string) {
    const address = await Address.findById(address_id);
    if (!address) {
      throw { statusCode: 400, message: 'Invalid address' };
    }
    return address;
  }

  static async validateDish(dish_id: string) {
    const dish = await Dish.findById(dish_id);
    if (!dish) {
      throw { statusCode: 400, message: `Dish not found: ${dish_id}` };
    }
    return dish;
  }


}

export default OrderValidator;
