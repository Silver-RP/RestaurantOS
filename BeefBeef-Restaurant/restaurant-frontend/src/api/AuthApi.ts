import { AxiosError } from 'axios';
import api from './axiosInstance';
import axiosInstance from './axiosInstance';
import { se } from 'date-fns/locale';

interface SendOtpResponse {
  message: string;
}

interface VerifyOtpResponse {
  message: string;
}

interface ChangePasswordResponse {
  message: string;
}

interface RefreshTokenResponse {
  accessToken: string;
}

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
const authApi = {
  sendOtpEmail: async (email: string): Promise<SendOtpResponse> => {
    const res = await api.post<SendOtpResponse>('/auth/forgot-password', {
      email,
    });
    return res.data;
  }, 

  sendOtpVerifyEmail: async (email: string): Promise<SendOtpResponse> => {
    const res = await api.post<SendOtpResponse>('/auth/resend-verification', {
      email: email.trim(),
    });
    return res.data;
  },

  verifyOtp: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    const res = await api.post<VerifyOtpResponse>('/auth/verify-otpEmail', {
      email: email.trim(),
      otp: otp.trim(),
    });
    return res.data;
  },

  verifyOtpEmail: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    const res = await api.post<VerifyOtpResponse>(
      '/auth/verify-resend-otpEmail',
      {
        email: email.trim(),
        otp: otp.trim(),
      },
    );
    return res.data;
  },

  changePassword: async (
    email: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<ChangePasswordResponse> => {
    const res = await api.post<ChangePasswordResponse>(
      '/auth/change-password',
      {
        email,
        newPassword,
        confirmPassword,
      },
    );
    return res.data;
  },
};

export default authApi;



export const refreshAccessToken = async (): Promise<RefreshTokenResponse | null> => {
  try {
    const response = await api.post<RefreshTokenResponse>(
      '/auth/refresh-token',
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message?: string }>;
    console.error(
      'Failed to refresh access token:',
      error.response?.data || error.message,
    );
    return null;
  }
};

export const changePasswordProfile = async (data: ChangePasswordPayload): Promise<{ message: string }> => {
  const response = await axiosInstance.put('/auth/change-password-profile', data);
  return response.data;
};