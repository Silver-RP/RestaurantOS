"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReservationContactController_1 = __importDefault(require("../controller/ReservationContactController"));
const router = (0, express_1.Router)();
router.post('/create', ReservationContactController_1.default.createReservationContact);
router.get('/getall', ReservationContactController_1.default.getAllReservationContact);
router.get('/getbyid/:id', ReservationContactController_1.default.getReservationById);
router.put('/update/:id', ReservationContactController_1.default.updateReservationContact);
router.delete('/delete/:id', ReservationContactController_1.default.deleteReservationContact);
exports.default = router;
