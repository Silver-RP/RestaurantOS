// services/TableService.ts
import { Table } from '../models/TableModel';
import { TableReservationStatus } from '../models/TableReservationStatusModel';

const TableService = {
  getAllTables: async () => {
    const tables = await Table.find().sort({ floor: 1, code: 1 }).lean();

    // Lấy thông tin trạng thái booking/holding cho tất cả bàn
    const tableCodes = tables.map((table) => table.code);
    const reservationStatuses = await TableReservationStatus.find({
      table_code: { $in: tableCodes },
      expireAt: { $gt: new Date() }, // Chỉ lấy những trạng thái chưa hết hạn
    }).lean();

    // Tạo map để tra cứu nhanh
    const statusMap = new Map();
    reservationStatuses.forEach((status) => {
      statusMap.set(status.table_code, status);
    });

    // Thêm thông tin trạng thái vào mỗi bàn
    const tablesWithStatus = tables.map((table) => {
      const reservationStatus = statusMap.get(table.code);
      return {
        ...table,
        isAvailable: table.isAvailable && !reservationStatus, // Bàn không available nếu đang được giữ/đặt
        reservationStatus: reservationStatus
          ? {
              status: reservationStatus.status,
              date: reservationStatus.date,
              time: reservationStatus.time,
              expireAt: reservationStatus.expireAt,
            }
          : null,
      };
    });

    return tablesWithStatus;
  },

  // Lấy thông tin bàn theo ngày và giờ cụ thể
  getTablesByDateTime: async (date: string, time: string) => {
    const tables = await Table.find().sort({ floor: 1, code: 1 }).lean();

    // Lấy thông tin trạng thái booking/holding cho ngày và giờ cụ thể
    const tableCodes = tables.map((table) => table.code);
    const reservationStatuses = await TableReservationStatus.find({
      table_code: { $in: tableCodes },
      date: date,
      time: time,
      expireAt: { $gt: new Date() },
    }).lean();

    // Tạo map để tra cứu nhanh
    const statusMap = new Map();
    reservationStatuses.forEach((status) => {
      statusMap.set(status.table_code, status);
    });

    // Thêm thông tin trạng thái vào mỗi bàn
    const tablesWithStatus = tables.map((table) => {
      const reservationStatus = statusMap.get(table.code);
      return {
        ...table,
        isAvailable: table.isAvailable && !reservationStatus,
        reservationStatus: reservationStatus
          ? {
              status: reservationStatus.status,
              date: reservationStatus.date,
              time: reservationStatus.time,
              expireAt: reservationStatus.expireAt,
            }
          : null,
      };
    });

    return tablesWithStatus;
  },

  getTableByCode: async (code: string) => {
    const table = await Table.findOne({ code }).lean();
    if (!table) return null;

    // Kiểm tra trạng thái booking/holding
    const reservationStatus = await TableReservationStatus.findOne({
      table_code: code,
      expireAt: { $gt: new Date() },
    }).lean();

    return {
      ...table,
      isAvailable: table.isAvailable && !reservationStatus,
      reservationStatus: reservationStatus
        ? {
            status: reservationStatus.status,
            date: reservationStatus.date,
            time: reservationStatus.time,
            expireAt: reservationStatus.expireAt,
          }
        : null,
    };
  },

  createTable: async (data: any) => {
    const table = new Table(data);
    return await table.save();
  },

  updateTable: async (code: string, updateData: any) => {
    const updated = await Table.findOneAndUpdate({ code }, updateData, { new: true });
    if (!updated) throw new Error('Table not found');
    return updated;
  },

  toggleTableAvailability: async (code: string) => {
    const table = await Table.findOne({ code });
    if (!table) throw new Error('Table not found');

    table.isAvailable = !table.isAvailable;
    return await table.save();
  },

  deleteTable: async (code: string) => {
    const deleted = await Table.findOneAndDelete({ code });
    if (!deleted) throw new Error('Table not found');
    return deleted;
  },
};

export default TableService;
