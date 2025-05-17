"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OrderService_1 = __importDefault(require("../services/OrderService"));
const mongoose_1 = require("mongoose");
const orderValidator_1 = __importDefault(require("../validators/orderValidator"));
class OrderController {
    placeOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const validation = orderValidator_1.default.validatePlaceOrder(req);
                if (!validation.valid) {
                    return res.status(400).json({ message: validation.message });
                }
                const userId = req.user.id;
                const { address_id, address, payment_method, delivery_type, items, order_type, delivery_time_type, scheduled_time, note, } = req.body;
                const order = yield OrderService_1.default.placeOrder({
                    userId,
                    address_id,
                    address,
                    payment_method,
                    delivery_type,
                    items,
                    order_type,
                    delivery_time_type,
                    scheduled_time,
                    note,
                });
                return res.status(201).json({
                    message: 'Order placed successfully',
                    order,
                });
            }
            catch (error) {
                console.error('Error placing order:', error.message);
                return res
                    .status(error.statusCode || 500)
                    .json({ message: error.message || 'Internal Server Error' });
            }
        });
    }
    getAllOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', filters } = req.query;
                const parsedSortOrder = sortOrder === 'asc' ? 1 : -1;
                const parsedPage = parseInt(page, 10);
                const parsedLimit = parseInt(limit, 10);
                const filtersObject = filters ? filters : {};
                const options = {
                    page: parsedPage,
                    limit: parsedLimit,
                    sortBy: sortBy,
                    sortOrder: parsedSortOrder,
                    filters: filtersObject,
                };
                const orders = yield OrderService_1.default.getAllOrders(options);
                return res.status(200).json({
                    message: 'Orders retrieved successfully',
                    orders,
                });
            }
            catch (error) {
                console.error('Error retrieving orders:', error.message);
                next(error);
                return res
                    .status(error.statusCode || 500)
                    .json({ message: error.message || 'Internal Server Error' });
            }
        });
    }
    getUserOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const userId = req.user.id;
                const deliveryStatus = typeof req.query.delivery_status === 'string' ? req.query.delivery_status : null;
                const page = req.query.page ? parseInt(req.query.page, 10) : 1;
                const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
                const result = yield OrderService_1.default.getUserOrders(userId, deliveryStatus, page, limit);
                return res.status(200).json(Object.assign({ message: 'Orders retrieved successfully' }, result));
            }
            catch (error) {
                console.error('Error retrieving orders:', error.message);
                next(error);
                return res
                    .status(error.statusCode || 500)
                    .json({ message: error.message || 'Internal Server Error' });
            }
        });
    }
    getOrderById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = new mongoose_1.Types.ObjectId(req.params.id);
                const order = yield OrderService_1.default.getOrderById(orderId);
                return res.status(200).json({
                    message: 'Order retrieved successfully',
                    order,
                });
            }
            catch (error) {
                console.error('Error retrieving order:', error.message);
                next(error);
                return res
                    .status(error.statusCode || 500)
                    .json({ message: error.message || 'Internal Server Error' });
            }
        });
    }
    updateOrderStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = new mongoose_1.Types.ObjectId(req.params.id);
                const { status } = req.body;
                const updatedOrder = yield OrderService_1.default.updateOrderStatus(orderId, status);
                return res.status(200).json({
                    message: 'Order status updated successfully',
                    order: updatedOrder,
                });
            }
            catch (error) {
                console.error('Error updating order status:', error.message);
                next(error);
                return res
                    .status(error.statusCode || 500)
                    .json({ message: error.message || 'Internal Server Error' });
            }
        });
    }
}
exports.default = new OrderController();
