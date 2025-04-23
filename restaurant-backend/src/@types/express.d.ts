import { Request } from 'express';

interface User {
    roles: mongoose.Types.ObjectId[];
  }
  declare global {
    namespace Express {
      interface Request {
        user?: User; 
      }
    }
  }
