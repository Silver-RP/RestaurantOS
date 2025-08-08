import ContactModel, { IContact } from '../models/ContactModel';

class ContactService {
  static async createContact(contactData: Partial<IContact>): Promise<IContact> {
    const contact = await ContactModel.create(contactData);
    return contact;
  }

  static async getAllContacts(params?: {
    date?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    subject?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    contacts: IContact[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
  }> {
    const { date, startDate, endDate, search, subject } = params ?? {};
    const page = Math.max(1, Number(params?.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params?.limit) || 10));

    const createdAtQuery: Record<string, Date> = {};

    const toStartOfDay = (d: Date): Date => {
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      return start;
    };

    const toEndOfDayExclusive = (d: Date): Date => {
      const end = new Date(d);
      end.setDate(end.getDate() + 1);
      end.setHours(0, 0, 0, 0);
      return end;
    };

    if (date) {
      const target = new Date(date);
      if (!isNaN(target.getTime())) {
        createdAtQuery.$gte = toStartOfDay(target);
        createdAtQuery.$lt = toEndOfDayExclusive(target);
      }
    } else {
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          createdAtQuery.$gte = toStartOfDay(start);
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          createdAtQuery.$lt = toEndOfDayExclusive(end);
        }
      }
    }

    const query: Record<string, unknown> = {};
    if (Object.keys(createdAtQuery).length > 0) {
      query.createdAt = createdAtQuery;
    }
    if (subject) {
      query.subject = subject;
    }
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const [contacts, totalItems] = await Promise.all([
      ContactModel.find(query)
        .populate('user', 'username email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ContactModel.countDocuments(query),
    ]);

    return {
      contacts: contacts as unknown as IContact[],
      totalItems,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    };
  }

  static async updateStatus(contactId: string, status: 'NEW' | 'PROCESSED') {
    const updated = await ContactModel.findByIdAndUpdate(
      contactId,
      { status },
      { new: true },
    );
    return updated;
  }
}

export default ContactService;
