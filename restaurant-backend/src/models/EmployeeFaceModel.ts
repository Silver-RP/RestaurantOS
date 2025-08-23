// src/models/EmployeeFaceModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployeeFace extends Document {
    employeeId: string;
    name: string;
    faceEmbedding: number[];
    lastVerifiedAt?: Date;
    verifiedCount?: number;
    verifiedLogs?: Array<{
        verifiedAt: Date;
        ip?: string;
        device?: string;
        shift?: string;
        action?: string;
    }>;
}

const EmployeeFaceSchema = new Schema<IEmployeeFace>({
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    faceEmbedding: { type: [Number], required: true },
    lastVerifiedAt: { type: Date },
    verifiedCount: { type: Number, default: 0 },
    verifiedLogs: [
        {
            verifiedAt: { type: Date, default: Date.now },
            ip: { type: String },
            device: { type: String },
            shift: { type: String, required: true }, // Thêm trường shift để lưu thông tin ca làm việc
            action: { type: String, required: true }, // Thêm trường action để lưu thông tin hành động
        }
    ]
});

export default mongoose.models.EmployeeFace || mongoose.model<IEmployeeFace>('EmployeeFace', EmployeeFaceSchema);