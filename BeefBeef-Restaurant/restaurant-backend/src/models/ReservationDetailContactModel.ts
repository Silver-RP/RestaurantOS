import mongoose, { Schema, Document, Model } from 'mongoose';
export interface IReservationDetailContact extends Document {
  reservation: mongoose.Schema.Types.ObjectId;
  reservationDate: Date;
  timeReservation: string;
  guestCount: number;
  users: mongoose.Schema.Types.ObjectId;
  status: string;
  notes: string;
  foods: mongoose.Schema.Types.ObjectId[];
}
const reservationDetailContactSchema = new mongoose.Schema({
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  foods: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
});
const ReservationDetailContact = mongoose.model<IReservationDetailContact>(
  'ReservationDetailContact',
  reservationDetailContactSchema,
);
export default ReservationDetailContact;
