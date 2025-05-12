import SearchService from '../services/SearchService';
import { Request, Response } from 'express';

class SearchController {
  async searchUsers(req: Request, res: Response) {
    try {
      const keyword = (req.query.keyword as string) || '';
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;

      const result = await SearchService.searchUsers(keyword, page, pageSize);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({
        status: 'ERROR',
        message: error.message,
      });
    }
  }
}

export default new SearchController();
