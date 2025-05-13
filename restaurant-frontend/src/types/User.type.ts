export interface User {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    isEmailVerified: boolean;
    googleId?: string;
    isActive?: boolean; 
    roles: { _id: string; name: string }[];
    createdAt: string;
    updatedAt: string;
  }
  