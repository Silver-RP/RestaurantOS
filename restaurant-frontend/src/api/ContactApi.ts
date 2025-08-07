import api from './axiosInstance';
import { AxiosError } from 'axios';
import { ContactRequest, ContactResponse } from '@/types/Contact.type';

export async function createContact(data: ContactRequest): Promise<ContactResponse> {
  const res = await api.post('/contact/createContact', data);
  return res.data;
}
