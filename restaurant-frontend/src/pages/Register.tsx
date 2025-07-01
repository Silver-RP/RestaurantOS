import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SlActionUndo } from 'react-icons/sl';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RegisterUser } from '../redux/feature/auth/authActions';
import { clearStatus } from '../redux/feature/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import ButtonComponent from '../components/pages/login/ButtonComponents';
import InputComponent from '../components/pages/login/InputComponents'; 
const Register = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [hasErrorToast, setHasErrorToast] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, success } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);
  
  const isFormValid = (): boolean => {
    const { username, email, password, confirmPassword } = formData;
    const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*[a-zA-Z0-9]@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return (
      username.trim() !== '' &&
      emailRegex.test(email) &&
      passwordRegex.test(password) &&
      password === confirmPassword
    );
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === 'username') {
      setErrors((prev) => ({
        ...prev,
        username:
          value.trim().length < 3
            ? 'Tên tài khoản phải có ít nhất 3 ký tự'
            : '',
      }));
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prev) => ({
        ...prev,
        email: emailRegex.test(value) ? '' : 'Email không hợp lệ',
      }));
    }
  
    if (name === 'password') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      setErrors((prev) => ({
        ...prev,
        password: passwordRegex.test(value)
          ? ''
          : 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số',
      }));
    }
  
    if (name === 'confirmPassword') {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === formData.password
            ? ''
            : 'Mật khẩu xác nhận không khớp',
      }));
    }
  };
  useEffect(() => {
    if (success) {
      toast.success('Đăng ký thành công! Vui lòng xác minh email của bạn.');
      navigate('/verify-otp-email', { state: { email: formData.email } });
      dispatch(clearStatus());
    }
    if (error) {
      // toast.error(error);
      dispatch(clearStatus());
    }
  }, [success, error, navigate, dispatch]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; 
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (username.trim().length < 3) {
      toast.error('Tên tài khoản phải có ít nhất 3 ký tự');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email không hợp lệ');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Mật khẩu cần ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Mật khẩu và xác nhận không khớp');
      return;
    }
    setIsSubmitting(true);
    dispatch(RegisterUser({ username, email, password, confirmPassword }))
    .unwrap()
    .then(() => {
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    })
    .catch((error) => {
      const errorMessage =
        typeof error === 'string'
          ? error
          : error?.message || error?.data?.message || 'Đăng ký thất bại';

      if (!hasErrorToast) {
        toast.error(errorMessage);
        setHasErrorToast(true);
        setTimeout(() => setHasErrorToast(false), 3000); // Reset sau 3s
      }
    })
    .finally(() => {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 800);
    });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextRef?: React.RefObject<HTMLInputElement>) => {
    if (e.key === 'Enter' && nextRef?.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  return (
    <div className="flex justify-center items-center bg-[url('/assets/images/register/background.jpg')] bg-cover bg-center w-full h-screen">
      <div className="px-10 py-8 text-center bg-black bg-opacity-70 rounded-lg shadow-lg w-full sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-4/12 h-auto max-w-lg">
        <h1 className="text-white font-bold text-3xl mb-6">
          Đăng ký tài khoản
        </h1>
        <form onSubmit={handleSubmit}>
          <InputComponent
            type="text"
            value={formData.username}
            placeholder="Tên tài khoản"
            name="username"
            onChange={handleChange}
            ref={usernameRef}
            onKeyDown={(e) => handleKeyDown(e, usernameRef)}

          />
          {errors.username && <p className="text-red-400 text-sm text-left mt-1">{errors.username}</p>}
          <InputComponent
            type="email"
            value={formData.email}
            placeholder="Email"
            name="email"
            onChange={handleChange}
            ref={emailRef}
            onKeyDown={(e) => handleKeyDown(e, emailRef)}
          />
          {errors.email && <p className="text-red-400 text-sm text-left mt-1">{errors.email}</p>}
          <InputComponent
            type="password"
            value={formData.password}
            placeholder="Mật khẩu"
            name="password"
            onChange={handleChange}
            ref={passwordRef}
            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
          />
          {errors.password && <p className="text-red-400 text-sm text-left mt-1">{errors.password}</p>}
          <InputComponent
            type="password"
            value={formData.confirmPassword}
            placeholder="Xác nhận mật khẩu"
            name="confirmPassword"
            onChange={handleChange}
            ref={confirmPasswordRef}
            onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)}
          />
          {errors.confirmPassword && <p className="text-red-400 text-sm text-left mt-1">{errors.confirmPassword}</p>}
          <ButtonComponent disabled={isSubmitting || !isFormValid()} htmlType="submit" text="Đăng ký" />
        </form>
       
       
        <div className="mt-6 text-sm text-white">
          <p>
            Bạn đã có tài khoản?{' '}
            <Link
              to="/login"
              className="text-white underline hover:text-secondaryColor"
            >
              Đăng nhập tại đây
            </Link>
          </p>
          <p className="flex items-center justify-start mt-6">
            <Link
              to="/"
              className="flex items-center text-white hover:text-secondaryColor"
            >
              <SlActionUndo className="mr-1 text-lg" />
              Quay lại trang chủ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
