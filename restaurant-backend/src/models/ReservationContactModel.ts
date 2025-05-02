import mongoose, { Schema, Document, Model } from 'mongoose';
export interface IReservationContact extends Document {
  tableType: string;
  activeHours: string;
  tableCount: number;
  location: string;
  users: mongoose.Schema.Types.ObjectId;
}
const reservationcontactSchema = new mongoose.Schema(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const ReservationContactModel = mongoose.model<IReservationContact>(
  'ReservationContact',
  reservationcontactSchema,
);
export default ReservationContactModel;
