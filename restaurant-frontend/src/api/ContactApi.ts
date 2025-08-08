import api from './axiosInstance';
import { AxiosError } from 'axios';
import {
  ContactRequest,
  ContactResponse,
  GetAllContactsResponse,
  ContactQueryParams,
} from '@/types/Contact.type';

export async function createContact(data: ContactRequest): Promise<ContactResponse> {
  const res = await api.post('/contact/createContact', data);
  return res.data;
}

export async function getAllContacts(
  params?: ContactQueryParams,
): Promise<GetAllContactsResponse> {
  const res = await api.get('/contact/getAllContact', { params });
  return res.data;
}

export async function updateContactStatus(
  id: string,
  status: 'NEW' | 'PROCESSED',
) {
  const res = await api.patch(`/contact/updateStatus/${id}`, { status });
  return res.data;
}

