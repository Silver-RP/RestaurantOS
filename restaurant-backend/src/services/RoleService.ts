
import RoleModel from "../models/RoleModel";
import User from "../models/UserModel";
import Permission from "../models/PermissionModel";
class RoleService {
  async GetAllRole(): Promise<any> {
    try {
      const roles = await RoleModel.find()
        .populate("permissions")
        .populate({
          path: "users",
          model: User,
        });

      return roles.length > 0 ? roles : null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async AddRole(name: string, description: string, permission: string[]): Promise<any> {
    try {
      const existingRole = await RoleModel.findOne({ name });
      if (existingRole) {
        throw new Error("Role already exists!");
      }

      const newRole = new RoleModel({ name, description, permission });
      await newRole.save();

      return newRole;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async GetRoleById(id: string): Promise<any> {
    try {
      const role = await RoleModel.findById(id)
        .populate({path: "permissions", model: Permission})
        .populate({
          path: "users",
          model: User,
        });

      return role;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async UpdateRole(id: string, data: any): Promise<any> {
    try {
      const updatedRole = await RoleModel.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
      );

      return updatedRole;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async DeleteRole(id: string): Promise<boolean> {
    try {
      const deletedRole = await RoleModel.findByIdAndDelete(id);
      return !!deletedRole;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default new RoleService();
