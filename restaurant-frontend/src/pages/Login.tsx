import React, { useState, useEffect, useRef } from 'react';
import InputComponent from '../components/pages/Login/InputComponents';
import ButtonComponent from '../components/pages/Login/ButtonComponents';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import CheckboxComponent from '../components/common/CheckboxComponents';
import { Link, useNavigate } from 'react-router-dom';
import { SlActionUndo } from 'react-icons/sl';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { LoginUser } from '../redux/feature/auth/authActions';
import { toast } from 'react-toastify';
import { clearStatus } from '../redux/feature/auth/authSlice';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, success } = useAppSelector((state) => state.auth);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (success) {
      toast.success('Đăng nhập thành công!');
      navigate('/');
    }
    if (error) {
      toast.error(error);
      dispatch(clearStatus());
    }
  }, [success, error, navigate, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormError('');
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const isFormValid = (): boolean => {
    return isEmailValid(formData.email) && isPasswordValid(formData.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const { email, password } = formData;

    if (!isEmailValid(email)) {
      setFormError('Email không hợp lệ');
      return;
    }

    if (!isPasswordValid(password)) {
      setFormError('Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await dispatch(LoginUser({ email, password, rememberMe })).unwrap();
      const { accessToken, refreshToken } = res;

      if (rememberMe) {
        Cookies.set('accessToken', accessToken, { expires: 7 });
        Cookies.set('refreshToken', refreshToken, { expires: 7 });
      }

      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    nextRef?: React.RefObject<HTMLInputElement> | null
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
            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
          />
          <InputComponent
            type="password"
            value={formData.password}
            placeholder="Mật khẩu"
            name="password"
            onChange={handleChange}
            ref={passwordRef}
            onKeyDown={(e) => handleKeyDown(e, null)}
          />

          {formError && (
            <div className="text-red-500 text-sm text-left mt-2">{formError}</div>
          )}

          <div className="flex justify-between items-center mt-4 mb-3">
            <CheckboxComponent
              label="Ghi nhớ đăng nhập"
              checked={rememberMe}
              onChange={handleCheckboxChange}
            />
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
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

        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="px-4 text-sm text-gray-300">Hoặc đăng nhập bằng</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>

        <div className="flex justify-center gap-8 mt-4">
          <FaFacebook className="text-facebook text-3xl cursor-pointer" />
          <FcGoogle className="text-3xl cursor-pointer" />
        </div>

        <div className="mt-6 text-sm text-white">
          <p>
            Bạn chưa có tài khoản?{' '}
            <Link to="/register" className="text-white underline hover:text-secondaryColor">
              Đăng ký tại đây
            </Link>
          </p>
          <p className="flex items-center justify-start mt-6">
            <Link to="/" className="flex items-center text-white hover:text-secondaryColor">
              <SlActionUndo className="mr-1 text-lg" />
              Quay lại trang chủ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
