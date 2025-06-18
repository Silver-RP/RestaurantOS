import { Router } from 'express';
import VoucherController from '../controller/VoucherController';
import AuthMiddleWare from '../middleware/AuthMiddleWare';

const router = Router();
router.use(AuthMiddleWare.verifyToken, AuthMiddleWare.verifyRole(['superadmin', 'manager']));

router.get('/getAllVouchers', VoucherController.getAllVouchers);
router.post('/createVoucher', VoucherController.createVoucher);
// Lấy voucher theo id
router.get('/getVoucherById/:id', VoucherController.getVoucherById);
// Cập nhật voucher
router.put('/updateVoucher/:id', VoucherController.updateVoucher);
// Xoá voucher
router.delete('/deleteVoucher/:id', VoucherController.deleteVoucher);

export default router; 