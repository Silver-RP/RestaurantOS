/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputComponent from "../components/pages/login/InputComponents";
import ButtonComponent from "../components/pages/login/ButtonComponents";
import { Link, useLocation } from "react-router-dom";
import { SlActionUndo } from "react-icons/sl";
import { toast } from "react-toastify";
import { useSendOtpEmail } from "../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordSchema, ForgotPasswordSchema } from "../types/Auth.type";

const ForgotPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { sendOtpEmail, loading, error } = useSendOtpEmail();

  const emailValue = watch("email");
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      if (error === "User not found") {
        toast.error("Email chưa được đăng ký trong hệ thống!");
      } else if (
        error ===
        "You have exceeded the limit for sending OTPs. Please try again later"
      ) {
        toast.error("Bạn đã vượt quá giới hạn gửi OTP. Vui lòng thử lại sau!");
      } else {
        toast.error(error || "Đã xảy ra lỗi khi gửi OTP!");
      }
    }
  }, [error]);

  const location = useLocation();
  const loginPath = location.state?.loginPath || "/login";

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      const res = await sendOtpEmail(data.email);
      if (res && res.message === "OTP sent successfully") {
        toast.success("Đã gửi OTP đến email của bạn!");
        navigate("/verify-otp", { state: { email: data.email, loginPath } });
      }
    } catch (err: any) {
      console.log("API error:", err?.response?.data);
    }
  };

  console.log("ForgotPassword component rendered: ", loginPath);

  return (
    <div className="flex justify-center items-center bg-[url('/assets/images/register/background.jpg')] bg-cover bg-center w-full h-screen">
      <div className="px-10 py-8 text-center bg-black bg-opacity-70 rounded-lg shadow-lg w-full sm:w-9/12 md:w-8/12 lg:w-6/12 xl:w-4/12 h-auto max-w-lg">
        <h1 className="text-white font-bold text-3xl mb-6">Quên Mật Khẩu</h1>
        <p className="text-gray-300 text-sm mb-6">
          Nhập email của bạn để nhận mã OTP.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputComponent
                  type="text"
                  placeholder="Nhập Email"
                  name="email"
                  value={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.email}
                />
              )}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <ButtonComponent
            htmlType="submit"
            text={loading ? "Đang gửi..." : "Gửi Yêu Cầu"}
            disabled={loading || !emailValue}
          />
        </form>

        <div className="mt-6 text-sm text-white">
          <p className="flex items-center justify-start mt-6">
            <Link
              to={loginPath}
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

export default ForgotPassword;
