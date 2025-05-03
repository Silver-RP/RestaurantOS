import { Router } from 'express';
import CartController from '../controller/CartController';

const router = Router();

router.put('/update/:id', CartController.UpdateCart); 
router.delete('/:cartId/item/:dishId',CartController.DeleteCartItem);
router.delete('/delete-all/:cartId',CartController.DeleteAllCart);
export default router;
