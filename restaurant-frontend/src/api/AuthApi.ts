import api from './axiosInstance';
import { useState } from 'react';   


interface SendOtpResponse {
  message: string;
}
interface VerifyOtpResponse {
  message: string;
}

export const useSendOtpEmail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtpEmail = async (
    email: string,
  ): Promise<SendOtpResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<SendOtpResponse>('/auth/send-otpEmail', {
        email,
      });
      return res.data;
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

  const verifyOtp = async (
    email: string,
    otp: string,
  ): Promise<VerifyOtpResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<VerifyOtpResponse>('/auth/verify-otpEmail', {
        email,
        otp,
      });
      return res.data;
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
