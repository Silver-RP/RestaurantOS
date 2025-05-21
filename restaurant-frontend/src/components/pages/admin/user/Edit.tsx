import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import { editUserSchema, EditUserFormValues } from '@/utils/zodSchemas';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRoles } from '@/hooks/useRoles';

interface RoleOption {
  value: string;
  label: string;
}
interface EditUserFormProps {
  roles: { _id: string; name: string }[];
  userData: any;
  onSubmit: (data: any) => void;
  disableRoleAndStatus?: boolean; // ← thêm
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  roles = [],
  userData,
  onSubmit,
  disableRoleAndStatus,
}) => {
  const navigate = useNavigate();
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
    setValue,
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      birthday: '',
      gender: undefined,
      status: 'inactive',
      isEmailVerified: false,
      roles: [],
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (userData) {
      Object.entries(userData).forEach(([key, value]) => {
        if (key === 'birthday' && typeof value === 'string') {
          setValue('birthday', value.slice(0, 10));
        } else if (key === 'roles' && Array.isArray(value)) {
          setValue('roles', value);
        } else {
          setValue(key as keyof EditUserFormValues, value);
        }
      });
    }
  }, [userData, setValue]);

  const onValid = (data: EditUserFormValues) => {
    const { confirmPassword, ...payload } = data;

    if (!payload.password) {
      delete payload.password;
    }

    onSubmit({ ...userData, ...payload });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Chỉnh sửa người dùng</h1>
      <form
        onSubmit={handleSubmit(onValid as (data: any) => void)}
        className="space-y-4"
      >
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

        <div>
          <label className="block text-sm mb-1">
            Mật khẩu <span className="text-red-600">*</span>
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">
            Xác nhận mật khẩu <span className="text-red-600">*</span>
          </label>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">
              Số điện thoại <span className="text-red-600">*</span>
            </label>
            <input
              {...register('phone')}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">
              Ngày sinh <span className="text-red-600">*</span>
            </label>
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

        <div>
          <label className="block text-sm mb-1">Giới tính </label>
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

        <div>
          <label className="block text-sm mb-1">Trạng thái tài khoản</label>
          <select
            {...register('status')}
            className="w-full border px-3 py-2 rounded"
            disabled={disableRoleAndStatus}
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="block">Bị khóa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Xác minh email</label>
          <select
            {...register('isEmailVerified', {
              setValueAs: (v) => v === 'true',
            })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="false">Chưa xác minh</option>
            <option value="true">Đã xác minh</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">
            Vai trò <span className="text-red-600">*</span>
          </label>
          <Controller
            name="roles"
            control={control}
            render={({ field }) => (
              <Select
                isMulti
                options={filteredRoleOptions}
                isDisabled={disableRoleAndStatus}
                value={filteredRoleOptions.filter((opt) =>
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

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
