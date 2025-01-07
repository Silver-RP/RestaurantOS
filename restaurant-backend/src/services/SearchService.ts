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

