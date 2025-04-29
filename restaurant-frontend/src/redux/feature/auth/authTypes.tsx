export interface User {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  address?: string;
  role: string[];
  isActive: boolean;
  isEmailVerified: boolean;  // Đã sửa lỗi chính tả từ isEmailVerifided thành isEmailVerified
}

export interface AuthState {
  userInfo: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
  message: string | null;
  token: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;  // Thêm thuộc tính rememberMe
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles?: string[];  // Thêm roles là optional
}
