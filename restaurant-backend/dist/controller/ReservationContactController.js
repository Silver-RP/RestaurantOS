'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const ReservationContactService_1 = __importDefault(
  require('../services/ReservationContactService'),
);
class ReservationContactController {
  // API giúp bên admin có thể tạo các loại bàn mới
  createReservationContact(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { tableType, activeHours, tableCount, location } = req.body;
        // Gọi phương thức createReservationContact từ đối tượng này
        const reservationcontact =
          yield ReservationContactService_1.default.createReservationContact(req.body);
        res.status(200).json(reservationcontact);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
  getAllReservationContact(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        // Gọi phương thức getAllReservationContact từ đối tượng này
        const reservationcontact =
          yield ReservationContactService_1.default.getAllReservationContact();
        res.status(200).json(reservationcontact);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
  getReservationById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        const reservationcontact =
          yield ReservationContactService_1.default.getReservationContactById(id);
        res.status(200).json(reservationcontact);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
  updateReservationContact(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        const { tableType, activeHours, tableCount, location } = req.body;
        const reservationcontact =
          yield ReservationContactService_1.default.updateReservationContact(id, req.body);
        res.status(200).json(reservationcontact);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
  deleteReservationContact(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        const reservationcontact =
          yield ReservationContactService_1.default.deleteReservationCotact(id);
        res.status(200).json(reservationcontact);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
}
exports.default = new ReservationContactController();
