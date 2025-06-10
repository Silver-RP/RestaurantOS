import { Router } from 'express';
import InventoryController from '../controller/InventoryController';

const router = Router();

router.get('/inventory-transaction', InventoryController.getInventoryTransantion );
router.post('/inventory-transaction ', InventoryController.createInventoryTransantion);
router.get('/inventory-transaction/:id', InventoryController.getInventoryTransactionById);
router.put('/inventory-transaction/:id', InventoryController.updateTransaction);
router.delete('/inventory-transaction/:id', InventoryController.deleteInventoryTransaction);
