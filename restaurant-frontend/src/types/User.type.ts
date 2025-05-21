export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  isVerified?: boolean;
  isEmailVerified: boolean;
  status: 'ERROR' | 'OK' | 'active' | 'inactive' | 'block' | null; 
  googleId?: string;
  isActive?: boolean;
  roles: { _id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}
export type FilterUserParams = {
  keyword?: string;
  page?: number;
  pageSize?: number;
  role?: string;
  gender?: string;
  status?: string;
  isVerified?: string;
  birthdayFrom?: string;
  birthdayTo?: string;
  nameSort?: string;
  emailSort?: string;
};