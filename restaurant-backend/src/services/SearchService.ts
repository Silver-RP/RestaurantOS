import mongoose, { FilterQuery, Model } from 'mongoose';
import Roles from '../models/RoleModel';
import User, { IUser } from '../models/UserModel';

class SearchService {
  async search(model: Model<any>, query: any, searchFields: string[]): Promise<any> {
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

  async searchUsers(keyword: string, page: number, pageSize: number) {
    try {
      const query = {
        $or: [
          { userName: { $regex: keyword, $options: 'i' } },
          { email: { $regex: keyword, $options: 'i' } },
          { phoneNumber: { $regex: keyword, $options: 'i' } },
        ],
      };

      const skip = (page - 1) * pageSize;

      const [users, totalDocuments] = await Promise.all([
        User.find(query).select('-password').sort({ userName: 1 }).skip(skip).limit(pageSize),
        User.countDocuments(query),
      ]);

      return {
        status: 'SUCCESS',
        data: {
          users,
          metadata: {
            total: totalDocuments,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(totalDocuments / pageSize),
          },
        },
      };
    } catch (error: any) {
      throw new Error(`Error searching users: ${error.message}`);
    }
  }
}

export default new SearchService();
