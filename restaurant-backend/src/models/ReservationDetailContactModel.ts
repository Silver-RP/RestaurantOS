import mongoose, { Schema, Document, Model } from "mongoose";
export interface IReservationDetailContact extends Document {
    reservation: mongoose.Schema.Types.ObjectId; 
    reservationDate: Date; 
    timeReservation: String; 
    guestCount: number;  
    user: mongoose.Schema.Types.ObjectId; 
    status: string, 
    notes: string, 
}
const reservationDetailContactSchema = new mongoose.Schema({
    reservation: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Reservation", 
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
        required:
        true,
    },
    status: {
        type: String, 
        enum: ["pending", "approved", "rejected"],
        required: true,
    }, 
    notes: {
        type: String, 
        required: false, 
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true, 
    }
})
const ReservationDetailContact = mongoose.model<IReservationDetailContact>("ReservationDetailContact", reservationDetailContactSchema);
export default ReservationDetailContact;