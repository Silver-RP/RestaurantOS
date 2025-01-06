import mongoose from 'mongoose';
import Permissions from './PermissionModel';  // Đảm bảo import đúng model Permissions

interface IRoles extends mongoose.Document {
  name: string;
  description: string | null;
  permissions: mongoose.Schema.Types.ObjectId[];
  users: mongoose.Schema.Types.ObjectId[];
}

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'permissions' }],  // Đảm bảo dùng tên đúng model 'permissions'
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Roles = mongoose.model<IRoles>('roles', RoleSchema);
export default Roles;
