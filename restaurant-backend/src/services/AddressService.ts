import mongoose from 'mongoose';
import { Address } from '../models/AddressModel';
import axios from 'axios';
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
      lat,
      lon,
    } = addressData;

    let finalLat = lat;
    let finalLon = lon;
    let finalProvince = province;
    let finalDistrict = district;
    let finalWard = ward;
    let finalStreet = street_address;

    // Nếu chưa có lat/lon thì gọi Nominatim để lấy thông tin
    if (!lat || !lon) {
      const fullQuery = `${street_address}, ${ward}, ${district}, ${province}, Vietnam`;
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: fullQuery,
          format: 'json',
          addressdetails: 1,
          limit: 1,
        },
        headers: {
          'User-Agent': 'beefbeef-app',
        },
      });

      const result = res.data[0];
      if (result) {
        finalLat = result.lat;
        finalLon = result.lon;

        // Nếu một trong các trường thiếu → bổ sung từ Nominatim
        const addr = result.address;
        finalProvince = finalProvince || addr.state || addr.city;
        finalDistrict = finalDistrict || addr.county || addr.district;
        finalWard = finalWard || addr.suburb || addr.village;
        finalStreet = finalStreet || addr.road;
      }
    }

    if (is_default) {
      await Address.updateMany({ user_id, is_default: true }, { $set: { is_default: false } });
    }

    const newAddress = new Address({
      user_id,
      full_name,
      phone,
      province: finalProvince,
      district: finalDistrict,
      ward: finalWard,
      street_address: finalStreet,
      address_type,
      is_default,
      lat: finalLat,
      lon: finalLon,
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
  const currentAddress = await Address.findById(addressId);
  if (!currentAddress) {
    throw new Error('Address not found');
  }

  // Nếu muốn set is_default, cần unset các địa chỉ khác
  if (updateData.is_default === true) {
    await Address.updateMany(
      { user_id: currentAddress.user_id, is_default: true },
      { $set: { is_default: false } }
    );
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

    if (!address || address.user_id.toString() !== userId) {
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
