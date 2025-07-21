export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  isEmailVerified: boolean;
  googleId?: string;
  isActive: boolean; // New field to indicate if the user is active
  roles: { _id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  userInfo: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
  message: string | null;
  token: string | null;
  isBirthday: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;  
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles?: string[];  
}
