/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import authApi from '../api/AuthApi';
import { changePasswordProfile as changePasswordApi } from '@/api/AuthApi';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useAuth = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  return {
    isAuthenticated,
    user
  };
};

export const useSendOtpEmail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtpEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.sendOtpEmail(email);
      return response;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Đã xảy ra lỗi khi gửi OTP';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendOtpEmail, loading, error };
};

export const useSendOtpVerifyEmail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtpVerifyEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.sendOtpVerifyEmail(email);
      return response;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Đã xảy ra lỗi khi gửi OTP';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendOtpVerifyEmail, loading, error };
};

export const useVerifyOtp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const verifyOtp = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyOtp(email, otp);
      return response;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Đã xảy ra lỗi khi xác minh OTP';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { verifyOtp, loading, error };
};

export const useVerifyOtpEmail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const verifyOtpEmail = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyOtpEmail(email, otp);
      return response;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Đã xảy ra lỗi khi xác minh OTP';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { verifyOtpEmail, loading, error };
};

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async (
    email: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.changePassword(
        email,
        newPassword,
        confirmPassword,
      );
    
      return response;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Lỗi khi đổi mật khẩu';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, error };
};

export const useChangePasswordProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const changePasswordProfile = async (data: ChangePasswordPayload, onSuccess?: () => void) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await changePasswordApi(data);
      setSuccessMessage(res.message);
      onSuccess?.();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đã xảy ra lỗi khi đổi mật khẩu');
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  return { changePasswordProfile, loading, error, successMessage };
};