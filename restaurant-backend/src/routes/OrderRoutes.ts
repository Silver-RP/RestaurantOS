import { Router } from 'express';
import OrderController from '../controller/OrderController';

const router = Router();

router.post('/place-order', OrderController.placeOrder);
router.get('/all-orders', OrderController.getAllOrders);
router.get('/user-orders', OrderController.getUserOrders);
router.get('/:id', OrderController.getOrderById);
router.put('/order-status/:id', OrderController.updateOrderStatus);

export default router;
