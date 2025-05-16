import { Model } from 'mongoose';
import User from '../models/UserModel';
import { Dish } from '../models/DishModel';

class SearchService {

  async searchModel(
    model: Model<any>,
    queryParams: any,
    searchFields: string[] = [],
    selectFields: string = '',
    sortBy: any = {},
  ) {
    const {
      keyword = '',
      page = 1,
      limit = 12,
    } = queryParams;

    const query: any = {};

    // Search keyword
    if (keyword && searchFields.length > 0) {
      query.$or = searchFields.map((field) => ({
        [field]: { $regex: keyword, $options: 'i' },
      }));
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      model.find(query).select(selectFields).sort(sortBy).skip(skip).limit(limit),
      model.countDocuments(query),
    ]);

    return {
      status: 'SUCCESS',
      docs: data,
      totalDocs: total,
      limit: Number(limit),
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    };
    
  }

  async searchUsers(queryParams: any) {
    return this.searchModel(
      User,
      queryParams,
      ['userName', 'email', 'phoneNumber'],
      '-password',
      { userName: 1 }
    );
  }

  async searchFoods(queryParams: any) {
    return this.searchModel(
      Dish,
      queryParams,
      ['name', 'description', 'shortDescription', 'ingredients'],
      '-image',
      { name: 1 },
    );
  }
}

export default new SearchService();
