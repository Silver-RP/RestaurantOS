/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import InputComponent from '../components/pages/login/InputComponents';
import ButtonComponent from '../components/pages/login/ButtonComponents';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SlActionUndo } from 'react-icons/sl';
import { toast } from 'react-toastify';
import { useChangePassword } from '../hooks/useAuth';
import { changePasswordSchema, ChangePasswordSchema } from '../types/Auth.type';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const loginPath = location.state?.loginPath || '/login';

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { changePassword, loading, error } = useChangePassword();
  const newPasswordValue = watch('newPassword');
  const confirmPasswordValue = watch('confirmPassword');

 
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  //  useEffect(() => {
  //    if (error) {
  //      if (error === 'Password changed successfully') {
  //         toast.success('Mật khẩu đã được thay đổi thành công!');
  //         navigate('/login');
  //      } 
  //    }
  //  }, [error]);

  const onSubmit = async (data: ChangePasswordSchema) => {
    try {
      const res = await changePassword(
        email,
        data.newPassword,
        data.confirmPassword,
      );
      if (res && res.message === 'Password changed successfully') {
        toast.success('Mật khẩu đã được thay đổi thành công!');
        navigate(loginPath);
      } else if (res && res.message === 'Invalid password format') {
        toast.error('Mật khẩu không hợp lệ!');
      } else if (res && res.message === 'Passwords do not match') {
        toast.error('Mật khẩu không khớp!');
      }
    } catch (err: any) {
      console.log('API error:', err?.response?.data);
    }
  };

  return (
    <div className="flex justify-center items-center bg-[url('/assets/images/register/background.jpg')] bg-cover bg-center w-full h-screen">
      <div className="px-10 py-8 text-center bg-black bg-opacity-70 rounded-lg shadow-lg w-full sm:w-9/12 md:w-8/12 lg:w-6/12 xl:w-4/12 h-auto max-w-lg">
        <h1 className="text-white font-bold text-3xl mb-6">Đặt Lại Mật Khẩu</h1>
        <p className="text-gray-300 text-sm mb-6">
          Nhập mật khẩu mới để tiếp tục.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <InputComponent
                type="password"
                placeholder="Mật khẩu mới"
                name="newPassword"
                value={field.value}
                onChange={field.onChange}
                hasError={!!errors.newPassword}
              />
            )}
          />
          {errors.newPassword && (
            <p className="text-red-400 text-sm text-left">
              {errors.newPassword.message}
            </p>
          )}

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <InputComponent
                type="password"
                placeholder="Xác nhận mật khẩu"
                name="confirmPassword"
                value={field.value}
                onChange={field.onChange}
                hasError={!!errors.confirmPassword}
              />
            )}
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm text-left">
              {errors.confirmPassword.message}
            </p>
          )}

          <ButtonComponent htmlType="submit" text="Xác Nhận" />
        </form>

        <div className="mt-6 text-sm text-white">
          <p className="flex items-center justify-start mt-6">
            <Link
              to={loginPath}
              className="flex items-center text-white hover:text-secondaryColor"
            >
              <SlActionUndo className="mr-1 text-lg" />
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
