"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReservationDetailContactController_1 = __importDefault(require("../controller/ReservationDetailContactController"));
const router = (0, express_1.Router)();
router.post("/create", ReservationDetailContactController_1.default.createReservationDetailContact);
router.get("/getall", ReservationDetailContactController_1.default.getAllReservationDetailContact);
router.get("/getbyid/:id", ReservationDetailContactController_1.default.getReservationDetailContactById);
router.put("/update/:id", ReservationDetailContactController_1.default.updateReservationDetailContact);
router.delete("/delete/:id", ReservationDetailContactController_1.default.deleteReservationDetailContact);
exports.default = router;
