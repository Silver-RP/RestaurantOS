import { Router } from 'express';
import FoodController from '../controller/FoodController';
import multer from 'multer';

// Sử dụng bộ nhớ tạm để upload ảnh
const storage = multer.memoryStorage(); 
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB
  });

const router = Router();

// API upload ảnh lên Cloudinary
router.post('/createfood', upload.single('image'), FoodController.createFood);
router.get("/get-top-favoritefood", FoodController.getTopFavoriteFood);
router.get("/get-all-food", FoodController.getAllFood);
router.get("/get-food-by-id", FoodController.getFoodById);
router.put("/update-food", FoodController.updateFood);
router.delete("/delete-food", FoodController.deleteFood);
router.get("/getFoodWithPagination", FoodController.getFoodWithPagination);
router.get("/getFoodByCategory", FoodController.getFoodByCategory);
router.get("/getFoodBySearch", FoodController.getFoodBySearch);
// router.get("/getFoodByPrice", FoodController.getFoodByPrice);
router.get("/getFoodByRating", FoodController.getFoodByRating);
router.get("/getFoodByFavorites", FoodController.getFoodByFavorites);
router.get("/searchfood", FoodController.SearchFood);
 
export default router;
