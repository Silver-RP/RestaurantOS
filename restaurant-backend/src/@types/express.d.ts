import { Request } from 'express';

interface User {
    // role là mảng object kiêu mongoose.Types.ObjectId
    roles: mongoose.Types.ObjectId[];
  }
  
  declare global {
    namespace Express {
      interface Request {
        user?: User; 
      }
    }
  }
