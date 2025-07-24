import React, { useState, useEffect, useRef } from 'react';
import InputComponent from '@/components/pages/login/InputComponents';
import ButtonComponent from '@/components/pages/login/ButtonComponents';

import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../redux/hook';
import { LoginUser } from '../../../../redux/feature/auth/authActions';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { fetchCurrentUser } from '@/redux/feature/user/userAction';

const AdminLoginPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormError('');
  };

  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return passwordRegex.test(password);
  };

  const isFormValid = (): boolean => {
    return isEmailValid(formData.email) && isPasswordValid(formData.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const { email, password } = formData;
    const rememberMe = false;

    if (!isEmailValid(email)) {
      setFormError('Email không hợp lệ');
      return;
    }

    if (!isPasswordValid(password)) {
      setFormError(
        'Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(LoginUser({ email, password, rememberMe }))
        .unwrap()
        .then((result) => {
          const userId = result.user._id;
          dispatch(fetchCurrentUser({ userId }));
          navigate('/admin');
        });
    } catch (error) {
      let message = 'Có lỗi xảy ra';
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (typeof error === 'string') {
        message = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        message = (error as any).message;
      }
      toast.error(message);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    nextRef?: React.RefObject<HTMLInputElement> | null,
  ) => {
    if (e.key === 'Enter' && nextRef?.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  return (
    <div className="flex justify-center items-center bg-[url('/assets/images/register/background.jpg')] bg-cover bg-center w-full h-screen">
      <div className="px-10 py-8 text-center bg-black bg-opacity-70 rounded-lg shadow-lg w-full sm:w-9/12 md:w-8/12 lg:w-6/12 xl:w-4/12 h-auto max-w-lg">
        <h1 className="text-white font-bold text-3xl mb-6">Đăng nhập</h1>
        <form onSubmit={handleSubmit}>
          <InputComponent
            type="email"
            value={formData.email}
            placeholder="Email"
            name="email"
            onChange={handleChange}
            ref={emailRef}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              handleKeyDown(e, passwordRef)
            }
          />
          <InputComponent
            type="password"
            value={formData.password}
            placeholder="Mật khẩu"
            name="password"
            onChange={handleChange}
            ref={passwordRef}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              handleKeyDown(e, null)
            }
          />

          {formError && (
            <div className="text-red-500 text-sm text-left mt-2">
              {formError}
            </div>
          )}

          <div className="flex justify-between items-center mt-4 mb-3">
            <button
              type="button"
              onClick={() =>
                navigate('/forgot-password', {
                  state: { loginPath: '/admin/login' },
                })
              }
              className="text-sm text-white hover:text-secondaryColor hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          <ButtonComponent
            htmlType="submit"
            text="Đăng nhập"
            disabled={isSubmitting || !isFormValid()}
          />
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
