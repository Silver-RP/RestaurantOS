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
exports.checkAddressOwner = void 0;
const AddressModel_1 = require("../models/AddressModel");
const mongoose_1 = __importDefault(require("mongoose"));
const checkAddressOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const addressId = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(addressId)) {
        res.status(400).json({ success: false, message: 'Invalid address ID' });
        return;
    }
    const address = yield AddressModel_1.Address.findById(addressId);
    if (!address) {
        res.status(404).json({ success: false, message: 'Address not found' });
        return;
    }
    if (!req.user || address.user_id.toString() !== req.user.id) {
        res.status(403).json({ success: false, message: 'Forbidden: not your address' });
        return;
    }
    next();
});
exports.checkAddressOwner = checkAddressOwner;
