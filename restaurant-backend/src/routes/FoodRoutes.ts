import { Router } from 'express';
import FoodController from '../controller/FoodController';
import SearchController from '../controller/SearchController';
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
router.get('/getFoodBest4', FoodController.getFoodBest4);
// router.get('/getFoodBySearch', FoodController.getFoodBySearch);
router.get('/getFoodByPrice', FoodController.getFoodByPrice);
router.get('/getFoodByRating', FoodController.getFoodByRating);
router.get('/getFoodByFavorites', FoodController.getFoodByFavorites);
router.post('/favorite', AuthMiddleWare.verifyToken, FoodController.toggleFavorite);
router.get('/getFavoriteFoods', AuthMiddleWare.verifyToken, FoodController.getFavoriteFoods);
router.post('/countFoodView/:foodId', FoodController.countFoodView);

router.get('/getFoodBySearch', AuthMiddleWare.verifyToken, SearchController.searchFoods);

export default router;
