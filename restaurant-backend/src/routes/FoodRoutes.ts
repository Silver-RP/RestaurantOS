import { Router } from 'express';
import FoodController from '../controller/FoodController';
import multer from 'multer';
import AuthMiddleWare from '../middleware/AuthMiddleWare';

// Sử dụng bộ nhớ tạm để upload ảnh
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

// API upload ảnh lên Cloudinary
router.post('/createfood', upload.array('images', 5), FoodController.createFood);
router.get('/getallfood', FoodController.getAllFood);
router.get('/getfoodbyid/:id', FoodController.getFoodById);
router.get('/getfoodbyslug/:slug', FoodController.getFoodBySlug);
router.put('/updatefood/:id',  upload.array('images', 5), FoodController.updateFood);
router.delete('/deletefood/:id', FoodController.deleteFood);
router.get('/getFoodByCategory', FoodController.getFoodByCategory);
router.get('/getFoodNewest', FoodController.getFoodByNewest);
router.get('/getFoodBest4', FoodController.getFoodBest4);
router.get('/getFoodByPrice', FoodController.getFoodByPrice);
router.get('/getFoodByRating', FoodController.getFoodByRating);
router.get('/getFoodByFavorites', FoodController.getFoodByFavorites);
router.post('/favorite', AuthMiddleWare.verifyToken, FoodController.toggleFavorite);
router.get('/getFavoriteFoods', AuthMiddleWare.verifyToken, FoodController.getFavoriteFoods);
router.post('/countFoodView/:foodId', FoodController.countFoodView);

export default router;
