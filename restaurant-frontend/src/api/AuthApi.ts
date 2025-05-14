import { AxiosError } from 'axios';
import api from './axiosInstance';
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

const authApi = {
  sendOtpEmail: async (email: string): Promise<SendOtpResponse> => {
    const res = await api.post<SendOtpResponse>('/auth/forgot-password', {
      email,
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