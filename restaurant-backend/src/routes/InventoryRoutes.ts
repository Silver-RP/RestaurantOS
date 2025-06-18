import { Router } from 'express';
import InventoryController from '../controller/InventoryController';

const router = Router();

router.get('/inventory-transaction', InventoryController.getInventoryTransaction);
router.get('/inventory-daily', InventoryController.getInventoryDaily);
router.post('/inventory-daily/import', InventoryController.importInventoryDaily); 
router.post('/inventory-daily/export', InventoryController.exportInventoryDaily); 
router.post('/inventory-daily/audit', InventoryController.auditInventoryDaily);

// router.get('/inventory-daily/:id', InventoryController.getInventoryDailyById);
// router.get('/inventory-report', InventoryController.getInventoryReport);

export default router;
