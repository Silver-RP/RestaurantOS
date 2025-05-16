import { Router } from 'express';
import CartController from '../controller/CartController';
const router = Router();

router.get('/getCart', CartController.getCartItems);
router.post('/add', CartController.AddItemToCart);
router.put('/update', CartController.UpdateCart);
router.delete('/item/:dishId', CartController.DeleteCartItem);
router.delete('/delete-all/:cartId', CartController.DeleteAllCart);
export default router;
