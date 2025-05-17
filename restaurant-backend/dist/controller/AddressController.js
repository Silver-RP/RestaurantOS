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
const AddressService_1 = __importDefault(require("../services/AddressService"));
const address_schema_1 = require("../schemas/address.schema");
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
const AddressModel_1 = require("../models/AddressModel");
class AddressController {
    createAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const parseResult = address_schema_1.CreateAddressSchema.safeParse(req.body);
                if (!parseResult.success) {
                    const errors = parseResult.error.format();
                    console.error('❌ BE: Lỗi validate dữ liệu tạo địa chỉ:', errors);
                    res.status(400).json({ success: false, message: 'Validation failed', errors });
                    return;
                }
                const input = parseResult.data;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(401).json({ success: false, message: 'Unauthorized: No user_id in token' });
                    return;
                }
                // ✅ Giới hạn tối đa 5 địa chỉ
                const addressCount = yield AddressModel_1.Address.countDocuments({ user_id: userId });
                if (addressCount >= 5) {
                    res.status(403).json({
                        success: false,
                        message: 'Bạn chỉ có thể lưu tối đa 5 địa chỉ.',
                    });
                    return;
                }
                // ✅ Kiểm tra trùng địa chỉ
                const isExisted = yield AddressModel_1.Address.findOne({
                    user_id: userId,
                    street_address: input.street_address,
                    ward: input.ward,
                    district: input.district,
                    province: input.province,
                });
                if (isExisted) {
                    res.status(409).json({
                        success: false,
                        message: 'Địa chỉ này đã tồn tại.',
                    });
                    return;
                }
                console.log('📥 Input address:', input);
                const address = yield AddressService_1.default.createAddress(Object.assign(Object.assign({}, input), { user_id: userId }));
                console.log('📦 Address after service:', address);
                res.status(201).json({
                    success: true,
                    message: 'Địa chỉ đã được chuẩn hóa và lưu thành công',
                    data: {
                        id: address._id,
                        full_name: address.full_name,
                        phone: address.phone,
                        province: address.province,
                        district: address.district,
                        ward: address.ward,
                        street_address: address.street_address,
                        lat: address.lat,
                        lon: address.lon,
                        is_default: address.is_default,
                        address_type: address.address_type,
                    },
                });
            }
            catch (error) {
                if ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) {
                    console.error('❌ Lỗi từ server:', error.response.data);
                }
                else {
                    console.error('❌ Lỗi không rõ:', error);
                }
                res.status(500).json({
                    success: false,
                    message: error.message || 'Internal server error',
                });
            }
        });
    }
    getAllAddresses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!user_id) {
                    res.status(401).json({ success: false, message: 'Unauthorized: No user_id in token' });
                    return;
                }
                const addresses = yield AddressService_1.default.getAllAddresses(user_id);
                res.status(200).json({
                    success: true,
                    message: 'Addresses retrieved successfully',
                    data: addresses,
                    total: addresses.length,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || 'Error fetching addresses',
                });
            }
        });
    }
    updateAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addressId = req.params.id;
                const parseResult = address_schema_1.CreateAddressSchema._def.schema.partial().safeParse(req.body);
                if (!parseResult.success) {
                    const errors = parseResult.error.format();
                    res.status(400).json({ success: false, message: 'Validation failed', errors });
                    return;
                }
                const updated = yield AddressService_1.default.updateAddress(addressId, parseResult.data);
                res.status(200).json({
                    success: true,
                    message: 'Address updated successfully',
                    data: updated,
                });
            }
            catch (error) {
                console.error('Update error:', error);
                res.status(500).json({ success: false, message: error.message || 'Internal server error' });
            }
        });
    }
    deleteAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addressId = req.params.id;
                if (!mongoose_1.default.Types.ObjectId.isValid(addressId)) {
                    res.status(400).json({ success: false, message: 'Invalid address ID format' });
                    return;
                }
                const deleted = yield AddressService_1.default.deleteAddress(addressId);
                if (!deleted) {
                    res.status(404).json({ success: false, message: 'Address not found' });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Address deleted successfully',
                    deletedId: addressId,
                });
            }
            catch (error) {
                console.error('Delete error:', error);
                res.status(500).json({ success: false, message: error.message || 'Internal server error' });
            }
        });
    }
    setDefaultAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const addressId = req.params.id;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(403).json({ success: false, message: 'Forbidden: User not authenticated' });
                    return;
                }
                if (!mongoose_1.default.Types.ObjectId.isValid(addressId)) {
                    res.status(400).json({ success: false, message: 'Invalid address ID format' });
                    return;
                }
                const updatedAddress = yield AddressService_1.default.setDefaultAddress(addressId, userId);
                if (!updatedAddress) {
                    res.status(404).json({ success: false, message: 'Address not found or not owned by user' });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Default address set successfully',
                    data: updatedAddress,
                });
            }
            catch (error) {
                console.error('Set default address error:', error);
                res.status(500).json({ success: false, message: error.message || 'Internal server error' });
            }
        });
    }
    searchAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = req.query.q;
            const limit = req.query.limit || 5;
            const agent = new https_1.default.Agent({ family: 4 });
            if (!query || query.split(',').length < 3) {
                res.status(400).json({ error: 'Địa chỉ chưa đầy đủ (ít nhất cần có đường, phường, quận)' });
                return;
            }
            try {
                const response = yield axios_1.default.get('https://nominatim.openstreetmap.org/search', {
                    params: {
                        q: query,
                        format: 'json',
                        addressdetails: 1,
                        countrycodes: 'vn',
                        limit,
                        bounded: 1,
                        viewbox: '106.3,10.95,107.0,10.6',
                    },
                    headers: {
                        'User-Agent': 'beefbeef-restaurant/1.0 (nguyenngocmy1311@gmail.com)',
                        'Accept-Language': 'vi',
                    },
                    timeout: 10000,
                    httpsAgent: agent,
                });
                res.json(response.data);
            }
            catch (error) {
                console.error('Nominatim API error:', error);
                res.status(500).json({ error: 'Failed to fetch from Nominatim' });
            }
        });
    }
}
exports.default = new AddressController();
