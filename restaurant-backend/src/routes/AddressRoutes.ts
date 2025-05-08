import { Router } from 'express';
import AddressController from '../controller/AddressController';
import { checkAddressOwner } from '../middleware/AddressMiddleware';


const router = Router();
router.get('/getall', AddressController.getAllAddresses)
router.put('/update/:id', checkAddressOwner, AddressController.updateAddress)
router.delete('/:id', checkAddressOwner, AddressController.deleteAddress);
router.put('/set-default/:id',checkAddressOwner, AddressController.setDefaultAddress);
router.post('/create', AddressController.createAddress); 
export default router;