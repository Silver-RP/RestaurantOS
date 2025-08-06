import ContactModel, { IContact } from '../models/ContactModel';

class ContactService {
    static async createContact(contactData: Partial<IContact>): Promise<IContact> {
        const contact = await ContactModel.create(contactData);
        return contact;
    }
}

export default ContactService;