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
router.get("/gettopfavoritefood", FoodController.getTopFavoriteFood); 
router.get("/getallfood", FoodController.getAllFood); // => ok 
router.get("/getfoodbyid/:id", FoodController.getFoodById);
router.put("/updatefood/:id", FoodController.updateFood);
router.delete("/deletefood/:id", FoodController.deleteFood);
router.get("/getFoodWithPagination", FoodController.getFoodWithPagination);
router.get("/getFoodByCategory", FoodController.getFoodByCategory); // Lấy danh sách các món ăn trả về theo danh mục món ăn
router.get("/getFoodBySearch", FoodController.getFoodBySearch); // Lấy danh sách các món ăn trả về theo từ khóa tìm kiếm
router.get("/getFoodByPrice", FoodController.getFoodByPrice);
router.get("/getFoodByRating", FoodController.getFoodByRating);
router.get("/getFoodByFavorites", FoodController.getFoodByFavorites);
router.get("/searchfood", FoodController.SearchFood);
 
export default router;
