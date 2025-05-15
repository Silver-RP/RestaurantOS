import { Router } from 'express';

import { FavoriteController } from '../controller/FavoriteController';

const router = Router();

router.get('/getFavorites', FavoriteController.list);

router.post('/add', FavoriteController.add);

router.delete('/item/:dishId', FavoriteController.remove);

export default router;
