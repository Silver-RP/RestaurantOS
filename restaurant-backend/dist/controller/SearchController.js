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
const SearchService_1 = __importDefault(require('../services/SearchService'));
class SearchController {
  searchUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const keyword = req.query.keyword || '';
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const result = yield SearchService_1.default.searchUsers(
          keyword,
          page,
          pageSize,
        );
        return res.status(200).json(result);
      } catch (error) {
        return res.status(500).json({
          status: 'ERROR',
          message: error.message,
        });
      }
    });
  }
}
exports.default = new SearchController();
