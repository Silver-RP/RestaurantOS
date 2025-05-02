'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const reservationcontactSchema = new mongoose_1.default.Schema(
  {
    tableType: {
      type: String,
      required: true,
    },
    activeHours: {
      type: String,
      required: true,
    },
    tableCount: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    users: {
      type: mongoose_1.default.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const ReservationContactModel = mongoose_1.default.model(
  'ReservationContact',
  reservationcontactSchema,
);
exports.default = ReservationContactModel;
