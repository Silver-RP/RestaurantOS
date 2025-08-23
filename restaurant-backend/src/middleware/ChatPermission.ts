import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import ChatBoxModel from '../models/ChatBoxModel';
import Roles from '../models/RoleModel';

export const verifyChatPermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { chatId } = req.params;
    const user = req.user as any;

    if (!user) {
      res.status(401).json({ message: 'Người dùng chưa xác thực' });
      return;
    }

    const userId = user._id?.toString() || user.id?.toString() || user.userId?.toString();

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      res.status(400).json({ message: 'Chat ID không hợp lệ' });
      return;
    }

    const chat = await ChatBoxModel.findById(chatId);
    if (!chat) {
      res.status(404).json({ message: 'Không tìm thấy phiên chat' });
      return;
    }

    const userRolesRaw = Array.isArray(user.roles) ? user.roles : user.roles ? [user.roles] : [];

    // Nếu user.roles là ObjectId string -> lookup theo _id,
    // nếu là tên role (ví dụ "user") -> dùng trực tiếp
    let roleNames: string[] = [];
    const allAreIds = userRolesRaw.length > 0 && userRolesRaw.every((r: any) => mongoose.Types.ObjectId.isValid(String(r)));

    if (allAreIds) {
      const roles = await Roles.find({ _id: { $in: userRolesRaw } }).select('name');
      roleNames = roles.map((r) => String(r.name).toLowerCase());
    } else {
      roleNames = userRolesRaw
        .map((r: any) => (typeof r === 'string' ? r.toLowerCase() : r?.name?.toLowerCase()))
        .filter(Boolean);
    }

    const hasRole = (role: string) => roleNames.includes(role.toLowerCase());

    const isUserChat = chat.user_id?.toString() === userId;
    const isCashierChat = chat.cashier_user_id?.toString() === userId;

    if (hasRole('superadmin') || hasRole('manager')) {
      // allow
    } else if (hasRole('cashier')) {
      if (!isCashierChat) {
        res.status(403).json({ message: 'Bạn không phải nhân viên xử lý phiên chat này' });
        return;
      }
    } else if (hasRole('user')) {
      if (!isUserChat) {
        res.status(403).json({ message: 'Bạn không có quyền truy cập phiên chat này' });
        return;
      }
    } else {
      res.status(403).json({ message: 'Vai trò không hợp lệ' });
      return;
    }

    (req as any).chat = chat;
    next();
  } catch (err: any) {
    console.error('verifyChatPermission error:', err?.message || err);
    res.status(500).json({ message: 'Lỗi xác thực quyền truy cập phiên chat' });
  }
};
