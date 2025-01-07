import { Model } from 'mongoose';

class SearchService {
  async search(
    model: Model<any>,
    query: any,
    searchFields: string[],
  ): Promise<any> {
    const { search = '', minPrice, maxPrice } = query;

    const searchQuery: any = {};

    if (search) {
      searchQuery.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
    }

    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
    }

    const data = await model.find(searchQuery);

    if (data.length === 0) {
      return { message: 'No data found!' };
    }

    return {
      total: data.length,
      data,
    };
  }
}

export default new SearchService();

// import SearchService from '../services/SearchService';
// import Food from '../models/FoodModel';
// import { Request, Response } from 'express';

// class FoodController {
//   async searchFood(req: Request, res: Response): Promise<any> {
//     try {
//       const result = await SearchService.search(Food, req.query, [
//         'name',
//         'description',
//       ]);
//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(500).json({ message: 'An error occurred', error });
//     }
//   }
// }

// export default new FoodController();
