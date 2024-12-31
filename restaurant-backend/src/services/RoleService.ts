import  RoleModel from "../models/RoleModel";
import { Request, Response, NextFunction } from 'express';
import UserModel from "../models/userModel";

class RoleService {
  async GetAllRole(req: Request, res: Response): Promise<any> {
    try {
      const roles = await RoleModel.find()
      .populate("permissions")
      .populate({
        path: "users", 
        model: UserModel, 
      })
      if (roles.length === 0) {
        return res.status(404).json({ message: 'No roles found!' });
      }

      return res.status(200).json(roles);
    } catch (error) {
      return res.status(500).json(error);
    }
  }


  async AddRole(req: Request, res: Response): Promise<any> {
    try {
      const { name, description, permission } = req.body;

      const existingRole = await RoleModel.findOne({ name });
      if (existingRole) {
        return res.status(400).json({ message: 'Role already exiting!' });
      }

      const newRole = new RoleModel({ name, description, permission });
      await newRole.save();
      return res.status(201).json({ message: 'Created successfully!' });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async GetRoleById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const role = await RoleModel.findById(id)
      .populate("permissions")
      .populate({
        path: "users", 
        model: UserModel, 
      })
      if (!role) {
        return res.status(404).json({ message: 'Role not found!' });
      }

      return res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  }

  async UpdateRole(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { name, description, permission } = req.body;

      const UpdateRole = await RoleModel.findByIdAndUpdate(
        id,
        { name, description, permission },
        { new: true, runValidators: true },
      );
      if (!UpdateRole) {
        res.status(404).json({ message: 'Role not found' });
      }
      return res
        .status(200)
        .json({ massage: 'Updated Successfully!', UpdateRole });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error });
    }
  }

  async DeleteRole(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;

      const DeleteRole = await RoleModel.findByIdAndDelete(id);
      if (!DeleteRole) {
        res.status(404).json({ message: 'Role not found' });
      }
      return res.status(200).json({ message: 'Deleted Successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error });
    }
  }
}
export default new RoleService();