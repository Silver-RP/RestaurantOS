import mongoose from 'mongoose';

interface IPermission extends Document {
  name: string;
  description: string | null;
}

const PermissionSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: true },
  decription: { type: String },
});

const Permissions = mongoose.model<IPermission>(
  'permissions',
  PermissionSchema,
);
export default Permissions;
