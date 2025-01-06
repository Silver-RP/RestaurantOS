import mongoose, { Document } from 'mongoose';

interface IPermission extends Document {
  permission_name: string;
  description: string | null;
}

const PermissionSchema = new mongoose.Schema({
  permission_name: { type: String, required: true, unique: true },
  description: { type: String }, 
});

const Permissions = mongoose.model<IPermission>('permissions', PermissionSchema);

export default Permissions;
