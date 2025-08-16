import { Request } from 'express';
import { IUser } from '../types/user.type';

interface User {
  roles: mongoose.Types.ObjectId[];
}
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
