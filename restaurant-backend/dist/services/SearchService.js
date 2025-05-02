'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const UserModel_1 = __importDefault(require('../models/UserModel'));
class SearchService {
  search(model, query, searchFields) {
    return __awaiter(this, void 0, void 0, function* () {
      const { search = '', minPrice, maxPrice } = query;
      const searchQuery = {};
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
      const data = yield model.find(searchQuery);
      if (data.length === 0) {
        return { message: 'No data found!' };
      }
      return {
        total: data.length,
        data,
      };
    });
  }
  searchUsers(keyword, page, pageSize) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const query = {
          $or: [
            { userName: { $regex: keyword, $options: 'i' } },
            { email: { $regex: keyword, $options: 'i' } },
            { phoneNumber: { $regex: keyword, $options: 'i' } },
          ],
        };
        const skip = (page - 1) * pageSize;
        const [users, totalDocuments] = yield Promise.all([
          UserModel_1.default
            .find(query)
            .select('-password')
            .sort({ userName: 1 })
            .skip(skip)
            .limit(pageSize),
          UserModel_1.default.countDocuments(query),
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
      } catch (error) {
        throw new Error(`Error searching users: ${error.message}`);
      }
    });
  }
}
exports.default = new SearchService();
