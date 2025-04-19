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
const ReservationDetailContactModel_1 = __importDefault(require("../models/ReservationDetailContactModel"));
class ReservationDetailContactService {
    createReservationDetailContact(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservationDetailContact = yield ReservationDetailContactModel_1.default.create(input);
            yield reservationDetailContact.save();
            return reservationDetailContact;
        });
    }
    getAllReservationDetailContact() {
        return __awaiter(this, void 0, void 0, function* () {
            const reservationDetailContact = yield ReservationDetailContactModel_1.default.find({})
                .populate("reservation", "tableType")
                .populate("users", "userName phone")
                .populate("foods", "name price countInStock");
            return reservationDetailContact;
        });
    }
    getReservationDetailContactById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservationDetailContact = yield ReservationDetailContactModel_1.default.findById(id)
                .populate("reservation", "tableType")
                .populate("users", "userName phone")
                .populate("foods", "name price countInStock");
            return reservationDetailContact;
        });
    }
    updateReservationDetailContact(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservationDetailContact = yield ReservationDetailContactModel_1.default.findByIdAndUpdate(id, input, { new: true });
            return reservationDetailContact;
        });
    }
    deleteReservationDetailContact(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservationDetailContact = yield ReservationDetailContactModel_1.default.findById(id);
            // Kiểm tra xem đơn hàng có món ăn đã chọn hay không nếu lớn 0 thì không thể xóa
            if (reservationDetailContact && reservationDetailContact.foods && reservationDetailContact.foods.length > 0) {
                throw new Error("Cannot delete reservation with selected foods.");
            }
            // kiểm trạng thái của đơn hàng nếu đã duyệt thì không thể xóa
            if (reservationDetailContact && reservationDetailContact.status && reservationDetailContact.status === "approved") {
                throw new Error("Cannot delete approved reservation.");
            }
            // Nếu không có vấn đề gì, thực hiện xóa
            const deletedReservationDetailContact = yield ReservationDetailContactModel_1.default.findByIdAndDelete(id);
            return deletedReservationDetailContact;
        });
    }
}
exports.default = new ReservationDetailContactService();
