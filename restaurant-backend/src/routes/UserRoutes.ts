import { Router } from 'express';
import UserController from '../controller/UserController';
import AuthMiddleWare from '../middleware/AuthMiddleWare';

const router = Router();

router.get('/getAllUser', AuthMiddleWare.verifyToken, UserController.getAllUser);
router.get('/getAllUserByUserRole', UserController.getAllUserByUserRole);
router.get('/getUserById/:userId', UserController.getUserById);
router.post('/blockUser/:userId', UserController.blockUser);
router.put('/updateUser/:userId', AuthMiddleWare.verifyToken, UserController.updateUser);
router.post(
  '/changePassword/:userId',
  AuthMiddleWare.verifyToken,
  UserController.changeUserPassword,
);
router.get('/filterUser', async (req, res) => {
  try {
    await UserController.filterUser(req, res);
  } catch {
    res.status(500).json({ message: 'Error filtering users' });
  }
});
router.post(
  '/addUser',
  AuthMiddleWare.verifyToken,
  AuthMiddleWare.verifyRole(['superadmin']),
  UserController.addUser,
);

export default router;
