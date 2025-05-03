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
const ReservationDetailContactService_1 = __importDefault(
  require('../services/ReservationDetailContactService'),
);
class ReservationDetailContactController {
  createReservationDetailContact(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { reservation, reservationDate, guestCount, timeReservation, status, user, notes } =
          req.body;
        const reservationDetailContact =
          yield ReservationDetailContactService_1.default.createReservationDetailContact(req.body);
        res.status(200).json(reservationDetailContact);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
  getAllReservationDetailContact(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const reservationDetailContact =
          yield ReservationDetailContactService_1.default.getAllReservationDetailContact();
        res.status(200).json(reservationDetailContact);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
  getReservationDetailContactById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        const reservationDetailContact =
          yield ReservationDetailContactService_1.default.getReservationDetailContactById(id);
        res.status(200).json(reservationDetailContact);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
  updateReservationDetailContact(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        const reservationDetailContact =
          yield ReservationDetailContactService_1.default.updateReservationDetailContact(
            id,
            req.body,
          );
        res.status(200).json(reservationDetailContact);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
  deleteReservationDetailContact(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { id } = req.params;
        const reservationDetailContact =
          yield ReservationDetailContactService_1.default.deleteReservationDetailContact(id);
        res.status(200).json(reservationDetailContact);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
}
exports.default = new ReservationDetailContactController();
