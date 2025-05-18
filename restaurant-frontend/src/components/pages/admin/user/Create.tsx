import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import Select from 'react-select';

import { useAddUser } from '@/hooks/useUsers';
import { createUserSchema, CreateUserFormValues } from '@/utils/zodSchemas';

interface RoleOption {
  value: string;
  label: string;
}

interface CreateUserFormProps {
  roles: { _id: string; name: string }[];
  onSubmit: (data: any) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  roles = [],
  onSubmit,
}) => {
  const navigate = useNavigate();
  const { loading, error } = useAddUser();

  const roleOptions: RoleOption[] = roles.map((role) => ({
    value: role._id,
    label: role.name,
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      status: 'inactive',
      isEmailVerified: false,
      roles: [],
    },
  });

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const onValid = (data: CreateUserFormValues) => {
    const { confirmPassword, ...payload } = data;
    onSubmit(payload);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Thêm người dùng mới</h1>
      <form onSubmit={handleSubmit(onValid)} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm mb-1">Tên người dùng *</label>
          <input
            {...register('username')}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email *</label>
          <input
            {...register('email')}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1">Mật khẩu *</label>
          <input
            type="password"
            {...register('password')}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm mb-1">Xác nhận mật khẩu *</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Phone & Birthday */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Số điện thoại</label>
            <input
              {...register('phone')}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">Ngày sinh</label>
            <input
              type="date"
              max={new Date().toISOString().split('T')[0]}
              {...register('birthday')}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.birthday && (
              <p className="text-red-500 text-sm">{errors.birthday.message}</p>
            )}
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm mb-1">Giới tính</label>
          <select
            {...register('gender')}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        {errors && (
          <p className="text-red-500 text-sm">{errors.gender?.message}</p>
        )}

        {/* Status */}
        <div>
          <label className="block text-sm mb-1">Trạng thái tài khoản</label>
          <select
            {...register('status')}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="block">Bị khóa</option>
          </select>
        </div>
        {errors && (
          <p className="text-red-500 text-sm">{errors.status?.message}</p>
        )}

        {/* Email verified */}
        <div>
          <label className="block text-sm mb-1">Xác minh email</label>
          <select
            {...register('isEmailVerified')}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="false">Chưa xác minh</option>
            <option value="true">Đã xác minh</option>
          </select>
        </div>
        {errors && (
          <p className="text-red-500 text-sm">
            {errors.isEmailVerified?.message}
          </p>
        )}
        {/* Roles */}
        <div>
          <label className="block text-sm mb-1">Vai trò *</label>
          <Controller
            name="roles"
            control={control}
            render={({ field }) => (
              <Select
                isMulti
                options={roleOptions}
                value={roleOptions.filter((opt) =>
                  field.value.includes(opt.value),
                )}
                onChange={(selected) =>
                  field.onChange(selected.map((opt) => opt.value))
                }
              />
            )}
          />
          {errors.roles && (
            <p className="text-red-500 text-sm">{errors.roles.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Đang lưu...' : 'Lưu người dùng'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
