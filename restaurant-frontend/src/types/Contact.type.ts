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