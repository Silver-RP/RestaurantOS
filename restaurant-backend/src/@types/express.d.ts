import { Request } from 'express';

interface User {
    roles: string[];  // roles nên là mảng string
  }
  
  declare global {
    namespace Express {
      interface Request {
        user?: User; 
      }
    }
  }
