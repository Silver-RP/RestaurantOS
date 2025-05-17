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
const mongoose_1 = __importDefault(require("mongoose"));
const orderValidator_1 = __importDefault(require("../validators/orderValidator"));
const AddressModel_1 = require("../models/AddressModel");
const OrderModel_1 = require("../models/OrderModel");
const OrderDetailModel_1 = require("../models/OrderDetailModel");
const CartModel_1 = __importDefault(require("../models/CartModel"));
const DishModel_1 = require("../models/DishModel");
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PENDING_PICKUP"] = "PENDING_PICKUP";
    DeliveryStatus["PICKED_UP"] = "PICKED_UP";
    DeliveryStatus["IN_TRANSIT"] = "IN_TRANSIT";
    DeliveryStatus["DELIVERED"] = "DELIVERED";
    DeliveryStatus["DELIVERY_FAILED"] = "DELIVERY_FAILED";
    DeliveryStatus["RETURN_REQUESTED"] = "RETURN_REQUESTED";
    DeliveryStatus["RETURNED"] = "RETURNED";
    DeliveryStatus["CANCELLED"] = "CANCELLED";
})(DeliveryStatus || (DeliveryStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PREPARING"] = "PREPARING";
    OrderStatus["SHIPPING"] = "SHIPPING";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["RETURNED"] = "RETURNED";
})(OrderStatus || (OrderStatus = {}));
class OrderService {
    handleAddress(userId, address_id, address, session) {
        return __awaiter(this, void 0, void 0, function* () {
            if (address_id) {
                yield orderValidator_1.default.validateAddress(address_id);
                return address_id;
            }
            if (address) {
                const newAddress = new AddressModel_1.Address(Object.assign({ user_id: userId }, address));
                const savedAddress = yield newAddress.save({ session });
                return savedAddress._id.toString();
            }
            throw { statusCode: 400, message: 'Address is required' };
        });
    }
    // tôi muốn truyền tổng số lượng sản phẩm vào database
    createOrder(userId, finalAddressId, payment_method, delivery_type, totalAmount, order_type, delivery_time_type, total_quantity, note, scheduled_time, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const items_price = totalAmount;
            const vat_amount = items_price * 0.08;
            const shipping_fee = 5000;
            const total_price = items_price + vat_amount + shipping_fee;
            const newOrder = new OrderModel_1.Order({
                user_id: userId,
                address_id: finalAddressId,
                payment_method,
                delivery_type,
                items_price,
                vat_amount,
                shipping_fee,
                total_price,
                total_quantity,
                delivery_status: 'PENDING_PICKUP',
                order_type,
                delivery_time_type,
                note,
                scheduled_time,
            });
            return yield newOrder.save({ session });
        });
    }
    updateDishCounts(orderItems, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateDishPromises = orderItems.map((item) => {
                return DishModel_1.Dish.updateOne({ _id: item.dish_id }, {
                    $inc: {
                        ordered_count: 1,
                        totalSoldQuantity: item.quantity,
                        countInStock: -1 * item.quantity,
                    },
                }, { session });
            });
            yield Promise.all(updateDishPromises);
        });
    }
    updateCart(userId, orderedDishIds, session) {
        return __awaiter(this, void 0, void 0, function* () {
            yield CartModel_1.default.updateOne({ userId }, {
                $pull: {
                    items: {
                        dishId: { $in: orderedDishIds }
                    }
                }
            }, { session });
        });
    }
    placeOrder(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, address_id, address, payment_method, delivery_type, items, order_type, delivery_time_type, scheduled_time, note } = input;
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const finalAddressId = yield this.handleAddress(userId, address_id, address, session);
                const { orderItems, totalAmount } = yield orderValidator_1.default.validateCartAndItems(userId, items, session);
                const total_quantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
                const savedOrder = yield this.createOrder(userId, finalAddressId, payment_method, delivery_type, totalAmount, order_type, delivery_time_type, total_quantity, note, scheduled_time, session);
                if (!savedOrder) {
                    throw { statusCode: 500, message: 'Order placement failed' };
                }
                // Save order details
                const orderDetailPromises = orderItems.map((item) => {
                    const orderDetail = new OrderDetailModel_1.OrderDetail({
                        order_id: savedOrder._id,
                        dish_id: item.dish_id,
                        dish_name: item.dish_name,
                        unit_price: item.unit_price,
                        quantity: item.quantity,
                        total_amount: item.total_amount,
                        note: item.note,
                    });
                    return orderDetail.save({ session });
                });
                yield Promise.all(orderDetailPromises);
                // Update dish counts
                yield this.updateDishCounts(orderItems, session);
                const orderedDishIds = items.map((item) => item.dish_id);
                yield this.updateCart(userId, orderedDishIds, session);
                yield session.commitTransaction();
                session.endSession();
                return savedOrder;
            }
            catch (error) {
                yield session.abortTransaction();
                session.endSession();
                throw {
                    statusCode: 500,
                    message: error.message || 'Order placement failed',
                };
            }
        });
    }
    getAllOrders(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, sortBy, sortOrder, filters } = options;
            const allowedSortBy = [
                'createdAt',
                'total_price',
                'status',
                'payment_method',
                'delivery_type',
                'order_type',
            ];
            const sortField = allowedSortBy.includes(sortBy) ? sortBy : 'createdAt';
            const allowedFilters = ['status', 'payment_method', 'delivery_type', 'order_type'];
            const query = {};
            allowedFilters.forEach((key) => {
                if (filters[key]) {
                    query[key] = filters[key];
                }
            });
            const skip = (page - 1) * limit;
            const [orders, total] = yield Promise.all([
                OrderModel_1.Order.find(query)
                    .sort({ [sortField]: sortOrder })
                    .skip(skip)
                    .limit(limit)
                    .populate('user_id address_id'),
                OrderModel_1.Order.countDocuments(query),
            ]);
            return {
                orders,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    getUserOrders(userId_1, deliveryStatus_1) {
        return __awaiter(this, arguments, void 0, function* (userId, deliveryStatus, page = 1, limit = 5) {
            try {
                const query = { user_id: userId };
                if (deliveryStatus) {
                    query.delivery_status = deliveryStatus;
                }
                const totalItems = yield OrderModel_1.Order.countDocuments(query);
                const totalPages = Math.ceil(totalItems / limit);
                const orders = yield OrderModel_1.Order.find(query)
                    .populate('address_id')
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean();
                const orderIds = orders.map((order) => order._id);
                const orderDetails = yield OrderDetailModel_1.OrderDetail.find({
                    order_id: { $in: orderIds },
                })
                    .populate({
                    path: 'dish_id',
                    select: 'name images categories',
                    populate: {
                        path: 'categories',
                        model: 'categories',
                        select: 'Cate_name',
                    },
                })
                    .lean();
                const detailsMap = new Map();
                for (const detail of orderDetails) {
                    const key = detail.order_id.toString();
                    if (!detailsMap.has(key)) {
                        detailsMap.set(key, []);
                    }
                    detailsMap.get(key).push(detail);
                }
                const ordersWithDetails = orders.map((order) => {
                    const details = detailsMap.get(order._id.toString()) || [];
                    const mappedItems = details.map((detail) => {
                        const dish = detail.dish_id;
                        const categoryNames = ((dish === null || dish === void 0 ? void 0 : dish.categories) || []).map((cat) => cat.Cate_name);
                        return Object.assign(Object.assign({}, detail), { dish_id: dish === null || dish === void 0 ? void 0 : dish._id, dish_name: dish === null || dish === void 0 ? void 0 : dish.name, dish_images: (dish === null || dish === void 0 ? void 0 : dish.images) || [], categories: categoryNames });
                    });
                    return Object.assign(Object.assign({}, order), { order_items: mappedItems });
                });
                return {
                    orders: ordersWithDetails,
                    totalItems,
                    totalPages,
                    currentPage: page,
                };
            }
            catch (error) {
                throw {
                    statusCode: error.statusCode || 500,
                    message: error.message || 'Error retrieving orders',
                };
            }
        });
    }
    getOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield OrderModel_1.Order.findById(orderId).populate('address_id').lean();
                if (!order) {
                    throw { statusCode: 404, message: 'Order not found' };
                }
                const orderItems = yield OrderDetailModel_1.OrderDetail.find({ order_id: orderId }).populate('dish_id').lean();
                return Object.assign(Object.assign({}, order), { order_items: orderItems });
            }
            catch (error) {
                throw {
                    statusCode: error.statusCode || 500,
                    message: error.message || 'Error retrieving order',
                };
            }
        });
    }
    updateOrderStatus(orderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield OrderModel_1.Order.findById(orderId);
                if (!order) {
                    throw { statusCode: 404, message: 'Order not found' };
                }
                order.delivery_status = status;
                const mappedStatus = this.mapDeliveryStatusToOrderStatus(order.delivery_status, order.order_type);
                order.status = mappedStatus;
                yield order.save();
                return order;
            }
            catch (error) {
                throw {
                    statusCode: error.statusCode || 500,
                    message: error.message || 'Error updating order status',
                };
            }
        });
    }
    mapDeliveryStatusToOrderStatus(deliveryStatus, orderType) {
        if (orderType === 'DINE_IN') {
            switch (deliveryStatus) {
                case DeliveryStatus.PENDING_PICKUP:
                    return OrderStatus.PREPARING;
                case DeliveryStatus.PICKED_UP:
                case DeliveryStatus.IN_TRANSIT:
                    return OrderStatus.SHIPPING;
                case DeliveryStatus.DELIVERED:
                    return OrderStatus.COMPLETED;
                case DeliveryStatus.DELIVERY_FAILED:
                    return OrderStatus.PENDING;
                case DeliveryStatus.RETURN_REQUESTED:
                case DeliveryStatus.RETURNED:
                    return OrderStatus.RETURNED;
                case DeliveryStatus.CANCELLED:
                    return OrderStatus.CANCELLED;
                default:
                    return OrderStatus.PENDING;
            }
        }
        else if (orderType === 'ONLINE') {
            switch (deliveryStatus) {
                case DeliveryStatus.PENDING_PICKUP:
                    return OrderStatus.PREPARING;
                case DeliveryStatus.PICKED_UP:
                case DeliveryStatus.IN_TRANSIT:
                    return OrderStatus.SHIPPING;
                case DeliveryStatus.DELIVERED:
                    return OrderStatus.COMPLETED;
                case DeliveryStatus.DELIVERY_FAILED:
                    return OrderStatus.CANCELLED;
                case DeliveryStatus.RETURN_REQUESTED:
                case DeliveryStatus.RETURNED:
                    return OrderStatus.RETURNED;
                case DeliveryStatus.CANCELLED:
                    return OrderStatus.CANCELLED;
                default:
                    return OrderStatus.PENDING;
            }
        }
        return OrderStatus.PENDING;
    }
}
exports.default = new OrderService();
