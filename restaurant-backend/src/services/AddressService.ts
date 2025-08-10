import mongoose from 'mongoose';
import { Address } from '../models/AddressModel';
import { IAddress } from '../types/address.type';
class AddressService {
  async createAddress(addressData: IAddress): Promise<any> {
    const {
      user_id,
      full_name,
      district,
      phone,
      province,
      ward,
      street_address,
      address_type,
      is_default = false,
    } = addressData;
    const finalProvince = province;
    const finalWard = ward;
    const finalStreet = street_address;
    if (is_default) {
      await Address.updateMany({ user_id, is_default: true }, { $set: { is_default: false } });
    }
    const newAddress = new Address({
      user_id,
      full_name,
      district,
      phone,
      province: finalProvince,
      ward: finalWard,
      street_address: finalStreet,
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
  async updateAddress(
    addressId: string,
    updateData: Partial<IAddress>,
    userId: string,
  ): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      throw new Error('Invalid address ID format');
    }
    const currentAddress = await Address.findById(addressId);
    if (!currentAddress) {
      throw new Error('Địa chỉ không tồn tại');
    }

    if (!currentAddress.user_id || currentAddress.user_id.toString() !== userId) {
      throw new Error('Bạn không có quyền chỉnh sửa địa chỉ này');
    }
    delete updateData.user_id; 
    if (updateData.is_default === true) {
      await Address.updateMany(
        { user_id: userId, is_default: true },
        { $set: { is_default: false } },
      );
    }
    if (!updateData.district) {
      updateData.district = currentAddress.district;
    }
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

    if (!address || address.user_id?.toString() !== userId) {
      return null;
    }

    await Address.updateMany(
      { user_id: userId, is_default: true },
      { $set: { is_default: false } },
    );

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { is_default: true },
      { new: true },
    );

    return updatedAddress;
  }
}
export default new AddressService();
