import { Router } from 'express';
import UserController from '../controller/UserController';
import SearchController from '../controller/SearchController';
import AuthMiddleWare from '../middleware/AuthMiddleWare';
const router = Router();

// router.get("/searchUsers",  SearchController.searchUsers);
router.get('/searchUser', async (req, res) => {
  try {
    await SearchController.searchUsers(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users' });
  }
});

export default router;
