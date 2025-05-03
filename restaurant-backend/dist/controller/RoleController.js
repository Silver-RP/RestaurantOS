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
const RoleService_1 = __importDefault(require('../services/RoleService'));
class RoleController {
  AddRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { name, description, permission } = req.body;
        const role = yield RoleService_1.default.AddRole(name, description, permission);
        res.status(201).json({ message: 'Role added successfully', role });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  }
  GetRoleById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const role = yield RoleService_1.default.GetRoleById(req.params.id);
        if (!role) {
          res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json(role);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  }
  GetAllRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const roles = yield RoleService_1.default.GetAllRole();
        if (!roles) {
          res.status(404).json({ message: 'No roles found!' });
        }
        res.status(200).json(roles);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  }
  UpdateRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { name, description, permissions } = req.body;
        const role = yield RoleService_1.default.UpdateRole(req.params.id, {
          name,
          description,
          permissions,
        });
        if (!role) {
          res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json({ message: 'Role updated successfully', role });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  }
  DeleteRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const success = yield RoleService_1.default.DeleteRole(req.params.id);
        if (!success) {
          res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json({ message: 'Role deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  }
}
exports.default = new RoleController();
