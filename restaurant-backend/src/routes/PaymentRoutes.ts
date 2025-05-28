import { Router } from 'express';
import { vnpayReturn, momoReturn } from '../controller/PaymentController';

const router = Router();

router.get('/vnpay-return', vnpayReturn);
router.get('/momo-return', momoReturn);
// router.post('/payment/momo-ipn', momoIPNHandler);


export default router;
