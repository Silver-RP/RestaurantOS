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
const StaffService_1 = __importDefault(require('../services/StaffService'));
class StaffController {
  getAllStaff(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const allStaff = yield StaffService_1.default.getAllStaff(
          page,
          pageSize,
        );
        return res.status(200).json(allStaff);
      } catch (error) {
        return res.status(500).json({
          status: 'Error',
          message: error.message,
        });
      }
    });
  }
  createStaff(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const staff = yield StaffService_1.default.createStaff(req.body);
        return res.status(201).json(staff);
      } catch (error) {
        return res.status(500).json({
          status: 'Error',
          message: error.message,
        });
      }
    });
  }
  updateStaff(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { staffId } = req.params;
        const data = req.body;
        const result = yield StaffService_1.default.updateStaff(staffId, data);
        if (result.status === 'SUCCESS') {
          return res.status(200).json({
            status: result.status,
            message: result.message,
            data: result.data,
          });
        } else {
          return res.status(400).json({
            status: result.status,
            message: result.message,
          });
        }
      } catch (error) {
        return res.status(500).json({
          status: 'ERROR',
          message: `Server error: ${error.message}`,
        });
      }
    });
  }
  deleteStaff(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { staffId } = req.params;
        const result = yield StaffService_1.default.deleteStaff(staffId);
        if (result.status === 'SUCCESS') {
          return res.status(200).json({
            status: result.status,
            message: result.message,
          });
        } else {
          return res.status(400).json({
            status: result.status,
            message: result.message,
          });
        }
      } catch (error) {
        return res.status(500).json({
          status: 'ERROR',
          message: `Server error: ${error.message}`,
        });
      }
    });
  }
  filterStaff(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const filterOptions = {
          nameSort: req.query.nameSort, // 'A->Z', 'Z->A'
          emailSort: req.query.emailSort, // 'A->Z', 'Z->A'
          gender: req.query.gender, // 'male', 'female', 'other'
          status: req.query.status, // 'active', 'inactive', 'blocked'
          startDate: req.query.startDate
            ? new Date(req.query.startDate)
            : undefined,
          endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
          page: req.query.page ? parseInt(req.query.page) : 1,
          pageSize: req.query.pageSize ? parseInt(req.query.pageSize) : 10,
        };
        const result = yield StaffService_1.default.filterStaff(filterOptions);
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
exports.default = new StaffController();
