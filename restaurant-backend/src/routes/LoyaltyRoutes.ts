import { Router } from 'express';
import LoyaltyController from '../controller/LoyaltyController';
import AuthMiddleWare from '../middleware/AuthMiddleWare';

const router = Router();

// Lấy thông tin tài khoản loyalty của user hiện tại
router.get('/account', AuthMiddleWare.verifyToken, LoyaltyController.getAccountInfo);
// Lấy lịch sử giao dịch điểm của user hiện tại
router.get('/history', AuthMiddleWare.verifyToken, LoyaltyController.getTransactionHistory);
// Cộng điểm khi đơn hàng thành công (có thể dùng cho webhook hoặc gọi từ BE)
router.post('/add-points', LoyaltyController.addPoints);

// (Có thể mở rộng: cho phép admin lấy info/history của user bất kỳ)
// router.get('/account/:userId', ...)
// router.get('/history/:userId', ...)

export default router; 