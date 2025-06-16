import { Router } from 'express';
import InventoryController from '../controller/InventoryController';

const router = Router();

// Inventory Transactions (Import / Export / Adjustment-linked)
router.get('/inventory-transaction', InventoryController.getInventoryTransaction);
router.post('/inventory-transaction', InventoryController.createInventoryTransaction);
router.get('/inventory-transaction/:id', InventoryController.getInventoryTransactionById);
router.put('/inventory-transaction/:id', InventoryController.updateTransaction);  // Only allow updating metadata like notes, within editable window
// router.delete('/inventory-transaction/:id', InventoryController.softDeleteTransaction); // Soft delete via isDeleted flag


router.get('/inventory-daily', InventoryController.getInventoryDaily);
router.post('/inventory-daily', InventoryController.importInventoryDaily); // Import daily inventory data
router.get('/inventory-daily/:id', InventoryController.getInventoryDailyById);
// router.delete('/inventory-daily/:id', InventoryController.softDeleteInventoryDaily);// Soft delete via isDeleted flag


// router.get('/inventory-adjustment', InventoryController.getInventoryAdjustment);
// router.post('/inventory-adjustment', InventoryController.createInventoryAdjustment);
// router.get('/inventory-adjustment/:id', InventoryController.getInventoryAdjustmentById);
// router.put('/inventory-adjustment/:id', InventoryController.updateInventoryAdjustment);

// router.get('/inventory-report', InventoryController.getInventoryReport);

export default router;
