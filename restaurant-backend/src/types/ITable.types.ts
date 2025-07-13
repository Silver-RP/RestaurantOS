import mongoose from 'mongoose';
import { Document, Types } from 'mongoose';

export interface ITable extends mongoose.Document {
  code: string;
  type: 'standard' | 'group' | 'quiet' | 'vip';
  capacity: number;

  floor: number;
  zone: 'main-hall' | 'balcony' | 'stage' | 'quiet-zone' | 'vip-zone';

  isQuietZone?: boolean;
  isAvailable: boolean;

  description?: string;
  position?: {
    x: number;
    y: number;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITableReservationStatus extends Document {
  table_code: string;
  date: string;
  time: string;
  status: 'holding' | 'booked';
  heldBy?: Types.ObjectId | null;
  reservation_id?: Types.ObjectId | null;
  expireAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
