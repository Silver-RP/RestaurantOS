import {Request, Response} from "express";
import RoleService from "../services/RoleService";

class RoleController {
  async AddRole(req: Request, res: Response): Promise<void> {
    await RoleService.AddRole(req, res);
  }

  async GetRoleById(req: Request, res: Response): Promise<void> {
    await RoleService.GetRoleById(req, res);
  }

  async GetAllRole(req: Request, res: Response): Promise<void> {
    await RoleService.GetAllRole(req, res);
  }

  async UpdateRole(req: Request, res: Response): Promise<void> {
    await RoleService.UpdateRole(req, res);
  }

  async DeleteRole(req: Request, res: Response): Promise<void> {
    await RoleService.DeleteRole(req, res);
  }
}
export default new RoleController();