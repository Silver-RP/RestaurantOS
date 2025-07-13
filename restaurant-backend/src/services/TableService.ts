// services/TableService.ts
import { Table } from '../models/TableModel';

const TableService = {
  getAllTables: async () => {
    return await Table.find().sort({ floor: 1, code: 1 }).lean();
  },

  getTableByCode: async (code: string) => {
    return await Table.findOne({ code }).lean();
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
