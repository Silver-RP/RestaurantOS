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
  googleId?: string;
  isActive?: boolean;
  roles: { _id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}
