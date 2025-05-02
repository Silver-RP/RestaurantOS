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
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
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
const PermissionService_1 = __importDefault(require('../services/PermissionService'));
class PermissionController {
  GetAllPermission(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const permissions = yield PermissionService_1.default.GetALlPermission();
        res.status(200).json(permissions);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
  AddPermission(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { name, description } = req.body;
        const permission = yield PermissionService_1.default.AddPermission(name, description);
        res.status(200).json(permission);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
  GetPermissionById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const id = req.params.id;
        const permission = yield PermissionService_1.default.GetPermissionById(id);
        res.status(200).json(permission);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
  UpdatePermission(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const id = req.params.id;
        const permission = yield PermissionService_1.default.UpdatePermission(id, req.body);
        res.status(200).json(permission);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
  DeletePermission(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const id = req.params.id;
        const permission = yield PermissionService_1.default.DeletePermission(id);
        res.status(200).json(permission);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
}
exports.default = new PermissionController();
