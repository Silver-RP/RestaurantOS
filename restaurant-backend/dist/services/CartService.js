'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const DishModel_1 = require('../models/DishModel');
const CartModel_1 = __importDefault(require('../models/CartModel'));
class CartService {
  static UpdateCart(id, dishId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
      if (
        !mongoose_1.default.Types.ObjectId.isValid(id) ||
        !mongoose_1.default.Types.ObjectId.isValid(dishId)
      ) {
        throw new Error('Invalid cartId or dishId');
      }
      const cart = yield CartModel_1.default.findById(id);
      if (!cart) {
        throw new Error('Cart not found');
      }
      if (cart.status !== 'pending') {
        throw new Error('Cannot update a checked out cart');
      }
      const dish = yield DishModel_1.Dish.findById(dishId);
      if (!dish) {
        throw new Error('Dish does not exist');
      }
      if (dish.status !== 'available') {
        throw new Error('Dish is not available for purchase');
      }
      const existingItem = cart.items.find(
        (item) => item.dishId.toString() === dishId,
      );
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > dish.countInStock) {
          throw new Error('Adding more exceeds available stock');
        }
        if (newQuantity > 0) {
          existingItem.quantity = newQuantity;
        } else {
          cart.items = cart.items.filter(
            (item) => item.dishId.toString() !== dishId,
          );
        }
      } else {
        if (quantity <= 0) {
          throw new Error('Cannot decrease item that does not exist in cart');
        }
        cart.items.push({
          dishId: new mongoose_1.default.Types.ObjectId(dishId),
          quantity,
          price: dish.price,
        });
      }
      // Cập nhật lại tổng tiền
      cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      yield cart.save();
      return cart;
    });
  }
  static DeleteCartItem(cartId, dishId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (
        !mongoose_1.default.Types.ObjectId.isValid(cartId) ||
        !mongoose_1.default.Types.ObjectId.isValid(dishId)
      ) {
        throw new Error('Invalid cartId or dishId');
      }
      const cart = yield CartModel_1.default.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      if (cart.status !== 'pending') {
        throw new Error('Cannot delete item from a non-pending cart');
      }
      if (cart.items.length === 0) {
        throw new Error('Cart is already empty');
      }
      const itemIndex = cart.items.findIndex(
        (item) => item.dishId.toString() === dishId,
      );
      if (itemIndex === -1) {
        throw new Error('Item not found in cart');
      }
      cart.items.splice(itemIndex, 1);
      cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      yield cart.save();
      return cart;
    });
  }
  static DeleteAllCart(cartId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!mongoose_1.default.Types.ObjectId.isValid(cartId)) {
        throw new Error('Invalid cartId');
      }
      const cart = yield CartModel_1.default.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
      if (cart.status !== 'pending') {
        throw new Error('Cannot delete from a checked out cart');
      }
      cart.items = [];
      cart.totalPrice = 0;
      yield cart.save();
      return cart;
    });
  }
}
exports.default = CartService;
