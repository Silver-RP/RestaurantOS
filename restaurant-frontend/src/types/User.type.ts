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
  ordersCount?: number;
  loyalty_tier?: {
    _id: string;
    tier_name: string;
    min_spent: number;
    discount: number;
    benefits?: string;
    sort_order: number;
  } | null;
  loyalty_total_spent?: number;
  loyalty_total_points?: number;
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