import mongoose from 'mongoose';
import { Address } from '../models/AddressModel';
class AddressService {
    async createAddress(addressData: any): Promise<any> {
        const {
          user_id,
          full_name,
          phone,
          province,
          district,
          ward,
          street_address,
          address_type,
          is_default = false,
        } = addressData;

        if (is_default) {
          await Address.updateMany(
            { user_id, is_default: true },
            { $set: { is_default: false } }
          );
        }

        const newAddress = new Address({
          user_id,
          full_name,
          phone,
          province,
          district,
          ward,
          street_address,
          address_type,
          is_default,
        });
    
        await newAddress.save();
        return newAddress;
    }

    async getAllAddresses(user_id: string): Promise<any[]> {
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
          throw new Error('Invalid user_id format');
        }
    
        const addresses = await Address.find({ user_id });
        return addresses;
    }

    async updateAddress(addressId: string, updateData: any): Promise<any> {
        const updatedAddress = await Address.findByIdAndUpdate(addressId, updateData, {
          new: true,
          runValidators: true,
        });
    
        return updatedAddress;
    }

    async deleteAddress(addressId: string): Promise<any> {
        const deletedAddress = await Address.findByIdAndDelete(addressId);
        return deletedAddress;
    }

    async setDefaultAddress(addressId: string, userId: string): Promise<any> {
        const address = await Address.findById(addressId);
      
        if (!address || address.user_id.toString() !== userId) {
          return null;
        }
      
        await Address.updateMany(
          { user_id: userId, is_default: true },
          { $set: { is_default: false } }
        );
      
        const updatedAddress = await Address.findByIdAndUpdate(
          addressId,
          { is_default: true },
          { new: true }
        );
      
        return updatedAddress;
      }
      

}
export default new AddressService();