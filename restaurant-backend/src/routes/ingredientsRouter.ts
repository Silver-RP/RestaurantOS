import { Router } from 'express';
import IngredientController from '../controller/IngredientController';

const router = Router();

router.get('/getall-ingredients', IngredientController.getAllIngredients);
router.post('/create-ingredients', IngredientController.createIngredient);
router.put('/update-ingredients/:id', IngredientController.updateIngredient);

router.delete('/softDelete-ingredients/:ingredientId', IngredientController.softDeleteIngredient);
router.get('/trash-ingredients', IngredientController.getTrashIngredients);
router.patch('/restore-ingredients/:ingredientId', IngredientController.restoreIngredient);
router.delete('/delete-ingredients/:ingredientId', IngredientController.permanentlyDeleteIngredient);

export default router;
