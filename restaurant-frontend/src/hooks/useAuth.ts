import { useState } from 'react';
import authApi from '../api/AuthApi';

import { changePasswordProfile } from '@/api/AuthApi';
interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
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
      const res = await changePasswordProfile(data);
      setSuccessMessage(res.message);
      onSuccess?.();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đã xảy ra lỗi khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return { changePasswordProfile, loading, error, successMessage };
};
