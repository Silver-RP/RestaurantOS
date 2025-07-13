// controller/TableController.ts
import { Request, Response } from 'express';
import TableService from '../services/TableService';

export const getAllTables = async (_req: Request, res: Response) => {
  try {
    const tables = await TableService.getAllTables();
    res.json({ success: true, data: tables });
  } catch (error) {
    console.error('Get all tables error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTableByCode = async (req: Request, res: Response) => {
  try {
    const table = await TableService.getTableByCode(req.params.code);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json({ success: true, data: table });
  } catch (error) {
    console.error('Get table by code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTable = async (req: Request, res: Response) => {
  try {
    const table = await TableService.createTable(req.body);
    res.status(201).json({ success: true, data: table });
  } catch (error) {
    console.error('Create table error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTable = async (req: Request, res: Response) => {
  try {
    const updated = await TableService.updateTable(req.params.code, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update table error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleTableAvailability = async (req: Request, res: Response) => {
  try {
    const result = await TableService.toggleTableAvailability(req.params.code);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Toggle table availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTable = async (req: Request, res: Response) => {
  try {
    const deleted = await TableService.deleteTable(req.params.code);
    res.json({ success: true, data: deleted });
  } catch (error) {
    console.error('Delete table error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
