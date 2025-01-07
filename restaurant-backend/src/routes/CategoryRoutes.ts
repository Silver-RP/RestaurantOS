import {Router} from "express";
import CategoryController from "../controller/CategoryController";

const router = Router();

router.post('/addcategory', CategoryController.AddCategory);
router.get('/getallcategory', CategoryController.GetAllCategory);
router.get('/getcategorybyid/:id', CategoryController.GetCategoryById);
router.put('/updatecategory/:id', CategoryController.UpdateCategory);
router.delete('/deletecategory/:id', CategoryController.DeleteCategory);
router.get('/searchcategory', CategoryController.SearchCategory);
router.get('/paginatecategory', CategoryController.PaginateCate);

export default router;  