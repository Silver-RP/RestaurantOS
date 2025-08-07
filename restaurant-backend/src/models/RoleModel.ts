import mongoose from 'mongoose';
import Permissions from './PermissionModel'; 
import IRoles from '../types/role.type';
const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: Permissions }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});
const Roles = mongoose.model<IRoles>('Roles', RoleSchema);
export default Roles;
