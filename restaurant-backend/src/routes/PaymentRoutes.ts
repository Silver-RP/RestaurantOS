import { Router } from 'express';
import { vnpayReturn } from '../controller/VnpayController';

const router = Router();

router.get('/vnpay-return', vnpayReturn);


export default router;
