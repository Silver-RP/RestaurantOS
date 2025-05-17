"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AddressModel_1 = require("../models/AddressModel");
const axios_1 = __importDefault(require("axios"));
class AddressService {
    createAddress(addressData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, full_name, phone, province, district, ward, street_address, address_type, is_default = false, lat, lon, } = addressData;
            let finalLat = lat;
            let finalLon = lon;
            let finalProvince = province;
            let finalDistrict = district;
            let finalWard = ward;
            let finalStreet = street_address;
            // Nếu chưa có lat/lon thì gọi Nominatim để lấy thông tin
            if (!lat || !lon) {
                const fullQuery = `${street_address}, ${ward}, ${district}, ${province}, Vietnam`;
                const res = yield axios_1.default.get('https://nominatim.openstreetmap.org/search', {
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
                yield AddressModel_1.Address.updateMany({ user_id, is_default: true }, { $set: { is_default: false } });
            }
            const newAddress = new AddressModel_1.Address({
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
            yield newAddress.save();
            return newAddress;
        });
    }
    getAllAddresses(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(user_id)) {
                throw new Error('Invalid user_id format');
            }
            const addresses = yield AddressModel_1.Address.find({ user_id });
            return addresses;
        });
    }
    updateAddress(addressId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentAddress = yield AddressModel_1.Address.findById(addressId);
            if (!currentAddress) {
                throw new Error('Address not found');
            }
            // Nếu muốn set is_default, cần unset các địa chỉ khác
            if (updateData.is_default === true) {
                yield AddressModel_1.Address.updateMany({ user_id: currentAddress.user_id, is_default: true }, { $set: { is_default: false } });
            }
            const updatedAddress = yield AddressModel_1.Address.findByIdAndUpdate(addressId, updateData, {
                new: true,
                runValidators: true,
            });
            return updatedAddress;
        });
    }
    deleteAddress(addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedAddress = yield AddressModel_1.Address.findByIdAndDelete(addressId);
            return deletedAddress;
        });
    }
    setDefaultAddress(addressId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield AddressModel_1.Address.findById(addressId);
            if (!address || address.user_id.toString() !== userId) {
                return null;
            }
            yield AddressModel_1.Address.updateMany({ user_id: userId, is_default: true }, { $set: { is_default: false } });
            const updatedAddress = yield AddressModel_1.Address.findByIdAndUpdate(addressId, { is_default: true }, { new: true });
            return updatedAddress;
        });
    }
}
exports.default = new AddressService();
