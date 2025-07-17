import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { useAddUser } from '@/hooks/useUsers';
import { createUserSchema, CreateUserFormValues } from '@/utils/zodSchemas';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRoles } from '@/hooks/useRoles';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const roleOptions: RoleOption[] = roles.map((role) => ({
    value: role._id,
    label: role.name,
  }));

  const currentUser = useSelector((state: RootState) => state.user.user);
  const { roles: allRoles } = useRoles();
  console.log('allRoles', allRoles);

  const filteredRoleOptions = useMemo(() => {
    if (!currentUser || !Array.isArray(currentUser.roles)) return [];

    const roleIds: string[] = currentUser.roles.map((role: any) =>
      typeof role === 'string' ? role : role._id,
    );
    const roleNames = roleIds
      .map((roleId: string) => {
        const found = allRoles.find((r) => r._id === roleId);
        return found?.name?.toLowerCase();
      })
      .filter(Boolean);

    const isManager = roleNames.includes('manager');
    const isSuperadmin = roleNames.includes('superadmin');

    if (isManager) {
      return roleOptions.filter((opt) =>
        ['staff', 'cashier'].includes(opt.label.toLowerCase()),
      );
    }

    if (isSuperadmin) {
      return roleOptions.filter(
        (opt) => !['superadmin', 'user'].includes(opt.label.toLowerCase()),
      );
    }

    return [];
  }, [roleOptions, currentUser, allRoles]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      status: 'inactive',
      isEmailVerified: 'false',
      roles: [],
    },
  });

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const onValid = (data: CreateUserFormValues) => {
    const { ...payload } = data;
    onSubmit(payload);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Thêm người dùng mới</h1>
      <form onSubmit={handleSubmit(onValid)} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm mb-1">
            Tên người dùng <span className="text-red-600">*</span>
          </label>
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
          <label className="block text-sm mb-1">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            {...register('email')}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm mb-1">
            Mật khẩu <span className="text-red-600">*</span>
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className="w-full border px-3 py-2 rounded pr-10"
          />
          <span
            className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-sm mb-1">
            Xác nhận mật khẩu <span className="text-red-600">*</span>
          </label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            className="w-full border px-3 py-2 rounded pr-10"
          />
          <span
            className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </span>
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
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
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
            <option value="" disabled selected>
              -- Chọn trạng thái --
            </option>
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
          <label className="block text-sm mb-1">
            Vai trò <span className="text-red-600">*</span>
          </label>
          <Controller
            name="roles"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  isMulti={false}
                  options={filteredRoleOptions}
                  value={
                    filteredRoleOptions.find(
                      (opt) => field.value?.[0] === opt.value,
                    ) || null
                  }
                  onChange={(selected) => {
                    field.onChange(selected ? [selected.value] : []);
                    field.onBlur(); // ⚠️ Trigger validate
                  }}
                  onBlur={field.onBlur}
                  placeholder="-- Chọn vai trò --"
                  classNamePrefix="react-select"
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
         
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
