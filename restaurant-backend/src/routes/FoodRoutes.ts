import { Router } from 'express';
import FoodController from '../controller/FoodController';
import multer from 'multer';
import AuthMiddleWare from '../middleware/AuthMiddleWare';

// Sử dụng bộ nhớ tạm để upload ảnh
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});

const router = Router();

// API upload ảnh lên Cloudinary
router.post('/createfood', upload.single('image'), FoodController.createFood);
router.get('/getallfood', FoodController.getAllFood);
router.get('/getfoodbyid/:id', FoodController.getFoodById);
router.get('/getfoodbyslug/:slug', FoodController.getFoodBySlug);
router.put('/updatefood/:id', FoodController.updateFood);
router.delete('/deletefood/:id', FoodController.deleteFood);
router.get('/getFoodByCategory', FoodController.getFoodByCategory);
router.get('/getFoodNewest', FoodController.getFoodByNewest);
router.post('/favorite', AuthMiddleWare.verifyToken, FoodController.toggleFavorite);
router.get('/getFavoriteFoods', AuthMiddleWare.verifyToken, FoodController.getFavoriteFoods);
router.post('/countFoodView/:foodId', FoodController.countFoodView);

export default router;
