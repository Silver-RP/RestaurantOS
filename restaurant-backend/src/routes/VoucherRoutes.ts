import { Router } from 'express';
import VoucherController from '../controller/VoucherController';
import AuthMiddleWare from '../middleware/AuthMiddleWare';

const router = Router();
// Route cho user lưu voucher (yêu cầu đăng nhập, không cần quyền admin)
router.post('/save-voucher', AuthMiddleWare.verifyToken, VoucherController.saveVoucherForUser);

router.use(AuthMiddleWare.verifyToken, AuthMiddleWare.verifyRole(['superadmin', 'manager']));

router.get('/getAllVouchers', VoucherController.getAllVouchers);
router.post('/createVoucher', VoucherController.createVoucher);
// Lấy voucher theo id
router.get('/getVoucherById/:id', VoucherController.getVoucherById);
// Cập nhật voucher
router.put('/updateVoucher/:id', VoucherController.updateVoucher);
// Xoá voucher
router.delete('/deleteVoucher/:id', VoucherController.deleteVoucher);

// Route public lấy voucher public, active có phân trang (không cần xác thực)
router.get('/public-vouchers', VoucherController.getPublicActiveVouchers);

export default router; 