import { Request, Response } from 'express';
import ContactService from '../services/ContactService';

class ContactController {
  static async postContact(req: Request, res: Response): Promise<any> {
    try {
      const user = req.user as any | undefined;
      const { subject, name, email, message, phone } = req.body;

      if (!subject || !message || !phone) {
        return res.status(400).json({ message: 'Chủ đề, nội dung và số điện thoại là bắt buộc.' });
      }

      let contactData: any = { subject, message, phone };

      if (user) {
        contactData.user = user.id;
        contactData.name = user.username;
        contactData.email = user.email;
      } else {
        if (!name || !email) {
          return res.status(400).json({ message: 'Tên và email là bắt buộc khi chưa đăng nhập.' });
        }
        contactData.name = name;
        contactData.email = email;
      }

      const contact = await ContactService.createContact(contactData);
      return res.status(201).json({ message: 'Gửi liên hệ thành công!', contact });
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi server', error: err });
    }
  }

  static async getAllContact(req: Request, res: Response): Promise<any> {
    try {
      const { date, startDate, endDate, search, subject, page, limit } = req.query as {
        date?: string;
        startDate?: string;
        endDate?: string;
        search?: string;
        subject?: string;
        page?: string;
        limit?: string;
      };

      const { contacts, totalItems, currentPage, totalPages } =
        await ContactService.getAllContacts({
          date,
          startDate,
          endDate,
          search,
          subject,
          page: page ? parseInt(page, 10) : undefined,
          limit: limit ? parseInt(limit, 10) : undefined,
        });

      return res.status(200).json({
        message: 'Lấy danh sách liên hệ thành công',
        data: contacts,
        totalItems,
        currentPage,
        totalPages,
      });
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi server', error: err });
    }
  }

  static async updateContactStatus(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params as { id: string };
      const { status } = req.body as { status: 'NEW' | 'PROCESSED' };
      if (!status || (status !== 'NEW' && status !== 'PROCESSED')) {
        return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
      }
      const updated = await ContactService.updateStatus(id, status);
      if (!updated) {
        return res.status(404).json({ message: 'Không tìm thấy liên hệ' });
      }
      return res.status(200).json({ message: 'Cập nhật trạng thái thành công', contact: updated });
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi server', error: err });
    }
  }
}

export default ContactController;
