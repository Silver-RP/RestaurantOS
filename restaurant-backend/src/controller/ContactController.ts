import { Request, Response } from 'express';
import ContactService from '../services/ContactService';
import { IUser } from '../models/UserModel';
import { Types } from 'mongoose';

class ContactController {
  static async postContact(req: Request, res: Response): Promise<any> {
    try {
      const user = req.user as IUser | undefined;
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
}

export default ContactController;
