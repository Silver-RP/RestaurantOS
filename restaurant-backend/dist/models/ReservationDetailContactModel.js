"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reservationDetailContactSchema = new mongoose_1.default.Schema({
    reservation: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'ReservationContact',
        required: true,
    },
    reservationDate: {
        type: Date,
        required: true,
    },
    guestCount: {
        type: Number,
        required: true,
    },
    timeReservation: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        required: true,
    },
    notes: {
        type: String,
        required: false,
    },
    users: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    foods: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Food',
        required: true,
    },
});
const ReservationDetailContact = mongoose_1.default.model('ReservationDetailContact', reservationDetailContactSchema);
exports.default = ReservationDetailContact;
