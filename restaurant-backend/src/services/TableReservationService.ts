import { TableReservationStatus } from '../models/TableReservationStatusModel';
import { Types } from 'mongoose';

const TableReservationService = {
  getAllStatus: async () => {
    return await TableReservationStatus.find().lean();
  },

  holdTable: async (
    table_code: string,
    userId: Types.ObjectId | string,
    date: string,
    time: string,
  ) => {
    const startTime = new Date(`${date}T${time}`);
    const expireAt = new Date(startTime.getTime() + 2.5 * 60 * 60 * 1000); // +2.5 hours

    // Check for any existing hold/booking that overlaps
    const overlapping = await TableReservationStatus.findOne({
      table_code,
      expireAt: { $gt: startTime },
    });

    if (overlapping) {
      console.error('[TableReservationService] Bàn đã bị giữ hoặc đặt:', {
        table_code,
        date,
        time,
        startTime,
        expireAt,
        overlapping,
      });
      throw new Error('TABLE_ALREADY_HELD');
    }

    const hold = new TableReservationStatus({
      table_code,
      date,
      time,
      status: 'holding',
      heldBy: userId,
      expireAt,
    });

    try {
      const result = await hold.save();
      console.log('[TableReservationService] Đã giữ bàn thành công:', result);
      return result;
    } catch (err) {
      console.error('[TableReservationService] Lỗi khi lưu trạng thái giữ bàn:', err);
      throw err;
    }
  },

  releaseTable: async (table_code: string, userId: Types.ObjectId | string) => {
    const result = await TableReservationStatus.findOneAndDelete({
      table_code,
      heldBy: userId,
      status: 'holding',
    });
    return result;
  },
};

export default TableReservationService;
