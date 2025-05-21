export interface User {
    _id: string;
    username: string;
    email: string;
    phone?: string | null;
    birthday?: string | null;
    gender?: string | null;
    status?: 'active' | 'inactive' | 'block' | null;
    avatar: string;
    isEmailVerified: boolean;
    roles: { _id: string; name: string }[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface UserState {
    user: User | null;
    selectedUser: User | null;   
    loading: boolean;
    error: string | null;
    loadingUpdate: boolean;
  }
  