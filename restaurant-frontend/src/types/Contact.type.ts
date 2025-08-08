export interface ContactRequest {
  subject: string;
  name?: string;
  email?: string;
  phone: string;
  message: string;
}

export interface ContactResponse {
  message: string;
  contact: {
    subject: string;
    name?: string;
    email?: string;
    phone: string;
    message: string;
    user?: string;
    createdAt: string;
    _id: string;
  };
}

export interface ContactItem {
  _id: string;
  subject: string;
  name?: string;
  email?: string;
  message: string;
  user?: {
    _id: string;
    username: string;
    email: string;
  } | null;
  phone?: string;
  createdAt: string;
  status: 'NEW' | 'PROCESSED';
}

export interface GetAllContactsResponse {
  message: string;
  data: ContactItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface ContactQueryParams {
  date?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  subject?: string;
  page?: number;
  limit?: number;
}