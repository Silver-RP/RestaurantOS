import SearchService from '../services/SearchService';
import { Request, Response } from 'express';

class SearchController {

  async searchUsers(req: Request, res: Response): Promise<any>  {
    try {
      const result = await SearchService.searchUsers(req.query);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        status: 'ERROR',
        message: error.message,
      });
    }
  }

  async searchFoods(req: Request, res: Response): Promise<any> {
    try {
      const result = await SearchService.searchFoods(req.query);
      return res.status(200).json({data: result});
    } catch (error: any) {
      return res.status(500).json({
        status: 'ERROR',
        message: error.message,
      });
    }
  }
  
}

export default new SearchController();
