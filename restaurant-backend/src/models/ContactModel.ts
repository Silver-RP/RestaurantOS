import mongoose, { Document } from 'mongoose';

export interface IContact extends Document {
  subject: string;
  name?: string;
  email?: string;
  message: string;
  user?: mongoose.Schema.Types.ObjectId | null;
  createdAt: Date;
  phone: string;
}

const contactSchema = new mongoose.Schema<IContact>(
  {
    subject: { type: String, required: true },
    name: { type: String },
    email: { type: String },
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    phone: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model<IContact>('Contact', contactSchema);
