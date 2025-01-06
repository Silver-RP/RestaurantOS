import mongoose from 'mongoose';
import Permissions from './PermissionModel';  // Đảm bảo import đúng model Permissions

interface IRoles extends mongoose.Document {
  name: string;
  description: string | null;
  permissions: mongoose.Schema.Types.ObjectId[];
  users: mongoose.Schema.Types.ObjectId[];
}

const RoleSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: true },
  decription: { type: String},
  permission: [{ type: mongoose.Schema.Types.ObjectId, ref: Permissions }],
});

const Roles = mongoose.model<IRoles>("Roles", RoleSchema);
export default Roles;  
