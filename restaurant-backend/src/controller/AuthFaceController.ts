import { Request, Response } from 'express';
import { verifyEmployeeFace, getFaceEmbedding } from '../services/FaceRecognitionService';
import EmployeeFaceModel from '../models/EmployeeFaceModel';

export async function verifyFace(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: 'Không cung cấp ảnh' });
      return;
    }
    const employee = await verifyEmployeeFace(file.buffer);
    if (!employee) {
      res.status(401).json({ message: 'Không nhận diện được khuôn mặt', success: false });
      return;
    }
    // Phân ca: ca sáng (9h-15h), ca chiều (15h-21h)
    const now = new Date();
    const hour = now.getHours();
    let shift = '';
    if (hour >= 9 && hour < 15) shift = 'morning';
    else if (hour >= 15 && hour < 21) shift = 'evening';
    else shift = 'out_of_shift';

    // Kiểm tra trạng thái xác thực trong ca
    const logs = employee.verifiedLogs || [];
    const todayLogs = logs.filter(l => {
      const logDate = new Date(l.verifiedAt);
      return logDate.toDateString() === now.toDateString() && l.shift === shift;
    });
    let action = '';
    if (todayLogs.length === 0) {
      action = 'check_in'; // vào ca
    } else if (todayLogs.length === 1) {
      action = 'check_out'; // ra ca
    } else {
      res.status(429).json({ message: 'Bạn đã xác thực đủ cho ca này', success: false });
      return;
    }

    // Audit: cập nhật thời gian và log xác thực
    employee.lastVerifiedAt = now;
    employee.verifiedCount = (employee.verifiedCount || 0) + 1;
    employee.verifiedLogs = logs;
    employee.verifiedLogs.push({
      verifiedAt: now,
      ip: req.ip,
      device: req.headers['user-agent'] || '',
      shift,
      action,
    });
    await employee.save();
      res.json({
        employeeId: employee.employeeId,
        name: employee.name,
        shift,
        action,
        success: true,
        verifiedAt: now,
      });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
}

export async function registerFace(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;
    const { employeeId, name } = req.body;
    if (!file || !employeeId || !name) {
      res.status(400).json({ message: 'Missing image, employeeId or name' });
      return;
    }
    const embedding = await getFaceEmbedding(file.buffer);
    if (!embedding) {
      res.status(400).json({ message: 'No face detected in image' });
      return;
    }
    const existed = await EmployeeFaceModel.findOne({ employeeId });
    if (existed) {
      res.status(409).json({ message: 'EmployeeId already exists' });
      return;
    }
    const employee = await EmployeeFaceModel.create({ employeeId, name, faceEmbedding: embedding });
    res.json({ message: 'Register face success', employee });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err });
  }
}