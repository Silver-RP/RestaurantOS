export interface User {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
    address?: string;
    role: string[];
    isActive: boolean;
    isEmailVerifided: boolean;
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
  }
  
  export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  