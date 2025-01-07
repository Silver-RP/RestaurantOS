import mongoose from 'mongoose';

interface IPermission extends mongoose.Document {
  name: string;
  description: string | null;
}

const PermissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'roles' }],
});

// Đảm bảo đăng ký model với tên 'permissions'
const Permissions = mongoose.model<IPermission>('permissions', PermissionSchema);

export default Permissions;
