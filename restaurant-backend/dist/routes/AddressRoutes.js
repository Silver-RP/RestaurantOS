"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AddressController_1 = __importDefault(require("../controller/AddressController"));
const AddressMiddleware_1 = require("../middleware/AddressMiddleware");
const LimitAddressMiddleWare_1 = require("../middleware/LimitAddressMiddleWare");
const router = (0, express_1.Router)();
router.get('/getall', AddressController_1.default.getAllAddresses);
router.put('/update/:id', AddressMiddleware_1.checkAddressOwner, AddressController_1.default.updateAddress);
router.delete('/:id', AddressMiddleware_1.checkAddressOwner, AddressController_1.default.deleteAddress);
router.put('/set-default/:id', AddressMiddleware_1.checkAddressOwner, AddressController_1.default.setDefaultAddress);
router.post('/create', AddressController_1.default.createAddress);
router.get('/searchmap', LimitAddressMiddleWare_1.addressSearchLimiter, AddressController_1.default.searchAddress);
exports.default = router;
