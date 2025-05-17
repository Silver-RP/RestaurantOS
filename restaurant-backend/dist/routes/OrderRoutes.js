"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = __importDefault(require("../controller/OrderController"));
const router = (0, express_1.Router)();
router.post('/place-order', OrderController_1.default.placeOrder);
router.get('/all-orders', OrderController_1.default.getAllOrders);
router.get('/user-orders', OrderController_1.default.getUserOrders);
router.get('/:id', OrderController_1.default.getOrderById);
router.put('/order-status/:id', OrderController_1.default.updateOrderStatus);
exports.default = router;
