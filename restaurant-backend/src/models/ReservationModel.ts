import mongoose from 'mongoose';
import { IReservation } from '../types/reservation.types';

const reservationSchema = new mongoose.Schema<IReservation>(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    full_name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    table_type: { type: String, required: true },
    number_of_people: { type: Number, required: true },
    note: { type: String, default: '' },
    is_choose_later: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'DONE'],
      default: 'PENDING',
    },
  },
  { timestamps: true },
);

export const Reservation = mongoose.model<IReservation>('Reservation', reservationSchema);
