"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CategoryController_1 = __importDefault(require("../controller/CategoryController"));
const UploadMiddleWare_1 = __importDefault(require("../middleware/UploadMiddleWare"));
const router = (0, express_1.Router)();
router.post('/addcategory', UploadMiddleWare_1.default.single('Cate_img'), CategoryController_1.default.AddCategory); // => ok
router.get('/getallcategory', CategoryController_1.default.GetAllCategory);
router.get('/getcategorybyid/:id', CategoryController_1.default.GetCategoryById);
router.put('/update/:id', UploadMiddleWare_1.default.single('Cate_img'), CategoryController_1.default.UpdateCategory);
router.delete('/delete/:id', CategoryController_1.default.DeleteCategory);
router.get('/searchcategory', CategoryController_1.default.SearchCategory);
router.get('/paginatecategory', CategoryController_1.default.PaginateCate);
exports.default = router;
