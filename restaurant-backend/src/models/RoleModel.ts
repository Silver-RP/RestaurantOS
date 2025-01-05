import mongoose from "mongoose";
import Permissions from "./PermissionModel";
interface IRoles extends Document{
    name: string;
    decription: string | null;
    permissions: string[];

}

const RoleSchema = new mongoose.Schema({
  name: { type: String, require: true },
  decription: { type: String},
  permission: [{ type: mongoose.Schema.Types.ObjectId, ref: Permissions }],
});

const Roles = mongoose.model<IRoles>("roles", RoleSchema);
export default Roles;  