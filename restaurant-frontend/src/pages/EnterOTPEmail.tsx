/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import InputComponent from "../components/pages/login/InputComponents";
import ButtonComponent from "../components/pages/login/ButtonComponents";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SlActionUndo } from "react-icons/sl";
import { toast } from "react-toastify";
import { useVerifyOtpEmail } from "../hooks/useAuth";
import { verifyOtpSchema, VerifyOtpSchema } from "../types/Auth.type";
import authApi from "@/api/AuthApi";

const EnterOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [countdown, setCountdown] = useState(60); // ⏳ 60 giây đếm ngược
  const [resendLoading, setResendLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VerifyOtpSchema>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { verifyOtpEmail, loading, error } = useVerifyOtpEmail();
  const otpValue = watch("otp");

  // Tự động quay lại nếu không có email
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  // Xử lý lỗi xác minh
  useEffect(() => {
    if (error) {
      if (error === "Invalid OTP") {
        toast.error("Mã OTP không hợp lệ!");
      } else if (error === "OTP expired") {
        toast.error("Mã OTP đã hết hạn! Vui lòng yêu cầu mã mới.");
        navigate("/register");
      } else if (error === "Email has already been verified") {
        toast.warning("Email đã được xác minh trước đó!");
        navigate("/login");
      }
    }
  }, [error]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Gửi lại OTP
  const handleResendOtp = async () => {
    if (!email) return;
    try {
      setResendLoading(true);
      await authApi.sendOtpVerifyEmail(email);
      toast.success("Đã gửi lại mã OTP!");
      setCountdown(60); // Reset lại 60 giây
    } catch {
      toast.error("Gửi lại OTP thất bại!");
    } finally {
      setResendLoading(false);
    }
  };

  const onSubmit = async (data: VerifyOtpSchema) => {
    try {
      const res = await verifyOtpEmail(email, data.otp);
      if (res && res.message.includes("Xác minh email thành công")) {
        toast.success("Xác minh OTP thành công!");
        navigate("/login");
      }
    } catch {
      // Xử lý lỗi phía server đã được xử lý qua useEffect(error)
    }
  };

  return (
    <div className="flex justify-center items-center bg-[url('/assets/images/register/background.jpg')] bg-cover bg-center w-full h-screen">
      <div className="px-10 py-8 text-center bg-black bg-opacity-70 rounded-lg shadow-lg w-full sm:w-9/12 md:w-8/12 lg:w-6/12 xl:w-4/12 h-auto max-w-lg">
        <h1 className="text-white font-bold text-3xl mb-6">Xác Thực OTP</h1>
        <p className="text-gray-300 mb-4">
          Vui lòng nhập mã OTP đã được gửi đến email{" "}
          <strong className="text-white">{email}</strong>
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
            text={loading ? "Đang xác minh..." : "Xác Nhận"}
            disabled={loading || !otpValue}
          />
        </form>

        <div className="mt-6 text-sm text-white space-y-2">
          <p className="text-gray-300">
            {countdown > 0 ? (
              <>
                Mã OTP sẽ hết hạn sau: <strong>{countdown}s</strong>
              </>
            ) : (
              <span className="text-red-400">Mã OTP đã hết hạn.</span>
            )}
          </p>

          {countdown === 0 && (
            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-secondaryColor underline"
            >
              {resendLoading ? "Đang gửi lại..." : "Gửi lại mã OTP"}
            </button>
          )}
        </div>

        <div className="mt-6 text-sm text-white">
          <Link
            to="/register"
            className="flex items-center justify-center text-white hover:text-secondaryColor"
          >
            <SlActionUndo className="mr-1 text-lg" />
            Quay lại đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnterOTP;
