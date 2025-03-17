"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CategoryController_1 = __importDefault(require("../controller/CategoryController"));
const router = (0, express_1.Router)();
router.post('/addcategory', CategoryController_1.default.AddCategory);
router.get('/getallcategory', CategoryController_1.default.GetAllCategory);
router.get('/getcategorybyid/:id', CategoryController_1.default.GetCategoryById);
router.put('/updatecategory/:id', CategoryController_1.default.UpdateCategory);
router.delete('/deletecategory/:id', CategoryController_1.default.DeleteCategory);
router.get('/searchcategory', CategoryController_1.default.SearchCategory);
router.get('/paginatecategory', CategoryController_1.default.PaginateCate);
exports.default = router;
