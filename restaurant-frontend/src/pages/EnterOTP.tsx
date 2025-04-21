import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyOtpSchema, VerifyOtpSchema } from '../schemas/auth.schema';
import InputComponent from '../components/pages/Login/InputComponents';
import ButtonComponent from '../components/pages/Login/ButtonComponents';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SlActionUndo } from 'react-icons/sl';
import { toast } from 'react-toastify';
import { useVerifyOtp } from '../api/AuthApi';

const EnterOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VerifyOtpSchema>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const { verifyOtp, loading, error } = useVerifyOtp();
  const otpValue = watch('otp');

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (error) {
      console.log('Error state updated:', error);
      if (error === 'Invalid OTP') {
        toast.error('Mã OTP không hợp lệ!');
      } else if( error === 'OTP expired') {
        toast.error('Mã OTP đã hết hạn! Vui lòng yêu cầu mã mới.');
        navigate('/forgot-password'); 
      } else if(error === 'Email has already been verified') {
        toast.warning('Email đã được xác minh trước đó!');
        navigate('/login'); 
      }
    }
  }, [error]);

  const onSubmit = async (data: VerifyOtpSchema) => {
    console.log('Submitting OTP:', { email, otp: data.otp });
    try {
      const res = await verifyOtp(email, data.otp);
      if (res && res.message === 'Email verified successfully') {
        toast.success('Xác minh OTP thành công!');
        navigate('/reset-password', { state: { email } });
      }
    } catch (err: any) {
      console.log('API error:', err?.response?.data);

    }
  };

  return (
    <div className="flex justify-center items-center bg-[url('/assets/images/register/background.jpg')] bg-cover bg-center w-full h-screen">
      <div className="px-10 py-8 text-center bg-black bg-opacity-70 rounded-lg shadow-lg w-full sm:w-9/12 md:w-8/12 lg:w-6/12 xl:w-4/12 h-auto max-w-lg">
        <h1 className="text-white font-bold text-3xl mb-6">Xác Thực OTP</h1>
        <p className="text-gray-300 text-sm mb-6">
          Vui lòng nhập mã OTP được gửi đến {email || 'email của bạn'}.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <InputComponent
                  type="text"
                  placeholder="Nhập mã OTP"
                  name="otp"
                  value={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.otp}
                />
              )}
            />
            {errors.otp && (
              <p className="text-red-400 text-sm text-left">
                {errors.otp.message}
              </p>
            )}
          </div>

          <ButtonComponent
            htmlType="submit"
            text={loading ? 'Đang xác minh...' : 'Xác Nhận'}
            disabled={loading || !otpValue}
          />
        </form>

        <div className="mt-6 text-sm text-white">
          <p className="flex items-center justify-start mt-6">
            <Link
              to="/login"
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

export default EnterOTP;
