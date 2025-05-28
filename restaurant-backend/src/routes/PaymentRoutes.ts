import { Router } from 'express';
import { vnpayReturn, momoReturn, paypalReturn } from '../controller/PaymentController';

const router = Router();

router.get('/vnpay-return', vnpayReturn);
router.get('/momo-return', momoReturn);
router.get('/paypal-return', paypalReturn);



export default router;
