import { Request, Response } from 'express';
import AddressService from '../services/AddressService';
import { CreateAddressSchema } from '../schemas/address.schema';
import mongoose from 'mongoose';
class AddressController {
  async createAddress(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = CreateAddressSchema.safeParse(req.body);

      if (!parseResult.success) {
        const errors = parseResult.error.format();
        res.status(400).json({ success: false, message: 'Validation failed', errors });
        return;
      }

      const address = await AddressService.createAddress(parseResult.data);

      res.status(201).json({
        success: true,
        message: 'Address created successfully',
        data: address,
      });
    } catch (error: any) {
      console.error('Error creating address:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error',
      });
    }
  }

  async getAllAddresses(req: Request, res: Response): Promise<void> {
    try {
      const user_id = req.query.user_id as string;
      
      if (!user_id) {
        res.status(400).json({ success: false, message: 'Missing user_id in query' });
        return;
      }

      const addresses = await AddressService.getAllAddresses(user_id);

      if (!addresses.length) {
        res.status(404).json({
          success: false,
          message: 'No addresses found for this user',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Addresses retrieved successfully',
        data: addresses,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Error fetching addresses',
      });
    }
  } 

  async updateAddress(req: Request, res: Response): Promise<void> {
    try {
      const addressId = req.params.id;
      const parseResult = CreateAddressSchema.partial().safeParse(req.body);

      if (!parseResult.success) {
        const errors = parseResult.error.format();
        res.status(400).json({ success: false, message: 'Validation failed', errors });
        return;
      }

      const updated = await AddressService.updateAddress(addressId, parseResult.data);

      res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        data: updated,
      });
    } catch (error: any) {
      console.error('Update error:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  async deleteAddress(req: Request, res: Response): Promise<void> {
    try {
      const addressId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        res.status(400).json({ success: false, message: 'Invalid address ID format' });
        return;
      }
  
      const deleted = await AddressService.deleteAddress(addressId);
  
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Address not found' });
        return;
      }
  
      res.status(200).json({
        success: true,
        message: 'Address deleted successfully',
        deletedId: addressId,
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }
  
  async setDefaultAddress(req: Request, res: Response): Promise<void> {
    try {
      const addressId = req.params.id;
      const userId = req.user?.id;
  
      if (!userId) {
        res.status(403).json({ success: false, message: 'Forbidden: User not authenticated' });
        return;
      }
  
      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        res.status(400).json({ success: false, message: 'Invalid address ID format' });
        return;
      }
  
      const updatedAddress = await AddressService.setDefaultAddress(addressId, userId);
  
      if (!updatedAddress) {
        res.status(404).json({ success: false, message: 'Address not found or not owned by user' });
        return;
      }
  
      res.status(200).json({
        success: true,
        message: 'Default address set successfully',
        data: updatedAddress,
      });
    } catch (error: any) {
      console.error('Set default address error:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }
  

}

export default new AddressController();
