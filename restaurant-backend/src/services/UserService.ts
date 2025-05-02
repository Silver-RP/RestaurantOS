import mongoose, { FilterQuery } from 'mongoose';
import Roles from '../models/RoleModel';
import User, { IUser } from '../models/UserModel';

interface FilterUserOptions {
  name?: string;
  email?: string;
  gender?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
  nameSort?: string;
  emailSort?: string;
}
class UserService {
  async getAllUser(): Promise<any> {
    try {
      const allUser = await User.find({});
      return {
        status: 'OK',
        message: 'getAllUser success',
        data: allUser,
      };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getAllUserByUserRole(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<any> {
    try {
      const allUserByUserRole = await User.find();
      const options = {
        page,
        limit: pageSize,
        populate: {
          path: 'roles',
          match: { name: 'user' },
          select: 'name description',
        },
        select: '-password',
      };

      const result = await User.paginate({}, options);

      const filteredUsers = allUserByUserRole.filter(
        (user) => user.roles && user.roles.length > 0,
      );

      return {
        status: 'OK',
        message: 'getAllUserByUserRole success',
        data: result.docs,
        pagination: {
          total: result.totalDocs,
          page: result.page,
          pageSize: result.limit,
          totalPages: result.totalPages,
        },
      };
    } catch (error: any) {
      console.error('Error fetching users with role user:', error);
      throw new Error('Failed to fetch users with role user');
    }
  }

  async getUserById(userId: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return {
          status: 'ERROR',
          message: 'Invalid User ID',
          data: null,
        };
      }

      const user = await User.findById(userId)
        .populate({
          path: 'roles',
          select: 'name description',
        })
        .select('-password');

      if (!user) {
        return {
          status: 'ERROR',
          message: 'User not found',
          data: null,
        };
      }

      return {
        status: 'OK',
        message: 'User details retrieved successfully',
        data: user,
      };
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      throw new Error('Failed to fetch user details');
    }
  }

  async blockUser(userId: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return {
          status: 'ERROR',
          message: 'Invalid User ID',
          data: null,
        };
      }

      const user = await User.findById(userId);
      if (!user) {
        return {
          status: 'ERROR',
          message: 'User not found',
          data: null,
        };
      }

      if (user.status === 'blocked') {
        user.status = 'active';
      } else {
        user.status = 'blocked';
      }
      await user.save();

      return {
        status: 'OK',
        message: `User ${user.status} successfully`,
        data: user,
      };
    } catch (error: any) {
      console.error('Error blocking user:', error);
      return {
        status: 'ERROR',
        message: 'Failed to block user',
        data: null,
      };
    }
  }

  async filterUsers(options: FilterUserOptions) {
    try {
      const query: any = {};

      if (options.gender) {
        query.gender = options.gender;
      }

      if (options.status) {
        query.status = options.status;
      }

      if (options.startDate || options.endDate) {
        query.exprireAt = {};
        if (options.startDate) {
          query.exprireAt.$gte = options.startDate;
        }
        if (options.endDate) {
          query.exprireAt.$lte = options.endDate;
        }
      }

      const userRole = await Roles.findOne({ name: 'user' });
      if (!userRole) {
        throw new Error("Role 'user' not found");
      }

      query.roles = userRole._id;

      const sort: any = {};
      if (options.nameSort) {
        sort.userName = options.nameSort === 'A->Z' ? 1 : -1;
      }

      if (options.emailSort) {
        sort.email = options.emailSort === 'A->Z' ? 1 : -1;
      }

      const page = options.page || 1;
      const limit = options.pageSize || 10;
      const skip = (page - 1) * limit;

      const [users, totalDocuments] = await Promise.all([
        User.find(query).select('-password').sort(sort).skip(skip).limit(limit),
        User.countDocuments(query),
      ]);

      return {
        status: 'SUCCESS',
        data: {
          users,
          metadata: {
            total: totalDocuments,
            page: page,
            pageSize: limit,
            totalPages: Math.ceil(totalDocuments / limit),
          },
        },
      };
    } catch (error: any) {
      throw new Error(`Error filtering users: ${error.message}`);
    }
  }
}
export default new UserService();
