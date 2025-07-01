"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CartController_1 = __importDefault(require("../controller/CartController"));
const router = (0, express_1.Router)();
router.get('/getCart', CartController_1.default.getCartItems);
router.post('/add', CartController_1.default.AddItemToCart);
router.put('/update', CartController_1.default.UpdateCart);
router.delete('/item/:dishId', CartController_1.default.DeleteCartItem);
router.delete('/delete-all/:cartId', CartController_1.default.DeleteAllCart);
exports.default = router;
