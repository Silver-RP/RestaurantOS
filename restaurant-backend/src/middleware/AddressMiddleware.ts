import { Request, Response, NextFunction } from 'express';
import { Address } from '../models/AddressModel';
import mongoose from 'mongoose';

export const checkAddressOwner = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
  const addressId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    res.status(400).json({ success: false, message: 'Invalid address ID' });
    return;
  }

  const address = await Address.findById(addressId);
  if (!address) {
    res.status(404).json({ success: false, message: 'Address not found' });
    return;
  }
  if (!req.user || address.user_id.toString() !== req.user.id) {
     res.status(403).json({ success: false, message: 'Forbidden: not your address' });
     return; 
  }

  next();
};
