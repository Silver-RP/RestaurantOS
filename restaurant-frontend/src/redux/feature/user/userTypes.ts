export interface User {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    isEmailVerified: boolean;
    roles: { _id: string; name: string }[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
  }
  