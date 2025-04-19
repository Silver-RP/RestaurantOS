"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Insert Permissions
// const insertPermissions = async () => {
//   const permissions = [
//     { permission_name: 'edit_user', description: 'Edit user details' },
//     { permission_name: 'block_user', description: 'Block user' },
//     { permission_name: 'view_user', description: 'View user details' },
//   ].filter(p => p.permission_name && p.permission_name.trim() !== '');
//   for (const permission of permissions) {
//     if (!permission.permission_name || permission.permission_name.trim() === null) {
//       console.log('Skipping permission with invalid permission_name:', permission);
//       continue; 
//     }
//     const existingPermission = await Permissions.findOne({ permission_name: permission.permission_name });
//     if (!existingPermission) {
//       const permissionDoc = new Permissions(permission);
//       await permissionDoc.save();
//       console.log(`Permission ${permission.permission_name} inserted`);
//     } else {
//       console.log(`Permission ${permission.permission_name} already exists`);
//       continue; 
//     }
//   }
// };
// Insert Roles
// const insertRoles = async () => {
//   try {
//     const permissions = await Permissions.find({
//       permission_name: { $in: ['create_user', 'edit_user', 'delete_user', 'view_user'] },
//     });
//     if (permissions.length === 0) {
//       console.log('No permissions found. Exiting role insertion.');
//       return;
//     }
//     const cashierRole = new Roles({
//       name: 'cashier',
//       description: 'Cashier with basic access',
//       permissions: permissions.map((p) => p._id),
//     });
//     await cashierRole.save();
//     const staffRole = new Roles({
//       name: 'staff',
//       description: 'Staff with standard access',
//       permissions: permissions.map((p) => p._id),
//     });
//     await staffRole.save();
//     const userRole = new Roles({
//       name: 'user',
//       description: 'User with limited access',
//       permissions: permissions.map((p) => p._id),
//     });
//     await userRole.save();
//     console.log('Roles inserted');
//   } catch (error) {
//     console.error('Error inserting roles:', error);
//   }
// };
// const insertUsers = async () => {
//   const cashierRole = await Roles.findOne({ name: 'cashier' });
//   const staffRole = await Roles.findOne({ name: 'staff' });
//   const userRole = await Roles.findOne({ name: 'user' });
//   // Check if roles are found, if not exit
//   if (!cashierRole || !staffRole || !userRole) {
//     console.log('One or more roles are missing. Exiting user insertion.');
//     return;
//   }
//   const hashedPassword = await bcrypt.hash('hashedpassword123', 10);
//   const users = [
//     { userName: 'Ngọc Trâm', email: 'ngoctram@gmail.com', phone: '331157890' },
//     { userName: 'Phúc Hưng', email: 'phuchung@gmail.com', phone: '331158901' },
//     { userName: 'Thanh Hương', email: 'thanhhuong@gmail.com', phone: '331159012' },
//     { userName: 'Minh Phương', email: 'minhphuong@gmail.com', phone: '331160123' },
//     { userName: 'Anh Tuấn', email: 'anhtuan@gmail.com', phone: '331161234' },
//     { userName: 'Lan Hương', email: 'lanhuong@gmail.com', phone: '331162345' },
//     { userName: 'Tùng Lâm', email: 'tunglam@gmail.com', phone: '331163456' },
//     { userName: 'Bảo Anh', email: 'baoanh@gmail.com', phone: '331164567' },
//     { userName: 'Quỳnh Như', email: 'quynhnhu@gmail.com', phone: '331165678' },
//   ];
//   for (const user of users) {
//     const userDoc = new User({
//       userName: user.userName,
//       email: user.email,
//       phone: user.phone,
//       password: hashedPassword,
//       roles: [userRole._id],
//       status: 'active',
//     });
//     await userDoc.save();
//     console.log(`User ${user.userName} inserted`);
//   }
// };
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    // await insertPermissions();
    // await insertRoles();
    // await insertUsers();
    mongoose_1.default.connection.close();
});
run();
