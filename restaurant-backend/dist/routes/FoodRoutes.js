'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const FoodController_1 = __importDefault(require('../controller/FoodController'));
const multer_1 = __importDefault(require('multer'));
// Sử dụng bộ nhớ tạm để upload ảnh
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});
const router = (0, express_1.Router)();
// API upload ảnh lên Cloudinary
router.post('/createfood', upload.single('image'), FoodController_1.default.createFood);
router.get('/getallfood', FoodController_1.default.getAllFood);
router.get('/getfoodbyid/:id', FoodController_1.default.getFoodById);
router.get('/getfoodbyslug/:slug', FoodController_1.default.getFoodBySlug);
router.put('/updatefood/:id', FoodController_1.default.updateFood);
router.delete('/deletefood/:id', FoodController_1.default.deleteFood);
router.get('/getFoodByCategory', FoodController_1.default.getFoodByCategory);
router.get('/getFoodBySearch', FoodController_1.default.getFoodBySearch);
router.get('/getFoodByPrice', FoodController_1.default.getFoodByPrice);
router.get('/getFoodByRating', FoodController_1.default.getFoodByRating);
router.get('/getFoodByFavorites', FoodController_1.default.getFoodByFavorites);
router.get('/searchfood', FoodController_1.default.SearchFood);
exports.default = router;
