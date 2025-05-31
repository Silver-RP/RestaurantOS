import { Router } from 'express';
import { vnpayReturn, momoReturn, paypalReturn, updatePaymentStatus } from '../controller/PaymentController';

const router = Router();

router.get('/vnpay-return', vnpayReturn);
router.get('/momo-return', momoReturn);
router.get('/paypal-return', paypalReturn);
router.put('/payment-status/:orderId', updatePaymentStatus );



export default router;
