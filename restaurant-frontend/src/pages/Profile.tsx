/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import ProfileSidebar from '../components/pages/proflie/ProfileSidebar';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateUserProfile } from '@/redux/feature/user/userAction';
import { toast } from 'react-toastify';
import { useChangePasswordProfile } from '@/hooks/useAuth';
import { useCheckPassword } from '@/hooks/useUsers';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Container from '@/components/common/Container';
import UserLoyaltyTier from '@/components/pages/proflie/UserLoyaltyTier';


const ProfilePage = () => {
  const [touchedFields, setTouchedFields] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { checkPassword } = useCheckPassword();
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [, setIsPasswordValid] = useState<boolean | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { changePasswordProfile, loading: changingPassword } =
    useChangePasswordProfile();

  const { user } = useSelector((state: RootState) => state.user);
  console.log('user in profile', user);
  
  const [formattedBirthday, setFormattedBirthday] = useState('');

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    phone: '',
    gender: '',
    birthday: '',
  });

  const [accountInfo, setAccountInfo] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const check = async () => {
        if (accountInfo.password.trim() && user?._id) {
          setIsCheckingPassword(true);
          try {
            await checkPassword(user._id, accountInfo.password, (isMatch) => {
              setIsPasswordValid(isMatch);
              setPasswordErrors((prev) => ({
                ...prev,
                password: isMatch ? '' : 'Mật khẩu hiện tại không chính xác',
              }));
            });
          } catch {
            setPasswordErrors((prev) => ({
              ...prev,
              password: 'Lỗi khi kiểm tra mật khẩu',
            }));
          } finally {
            setIsCheckingPassword(false);
          }
        }
      };

      check();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [accountInfo.password, user?._id]);

  useEffect(() => {
    if (user) {
      let birthdayFormattedForInput = '';
      let birthdayFormattedForView = '';

      if (user.birthday) {
        const dateObj = new Date(user.birthday);

        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');

        birthdayFormattedForInput = `${yyyy}-${mm}-${dd}`;
        birthdayFormattedForView = `${dd}-${mm}-${yyyy}`;
      }

      setPersonalInfo({
        fullName: user.username || '',
        phone: user.phone || '',
        gender: user.gender || '',
        birthday: birthdayFormattedForInput,
      });

      setAccountInfo((prev) => ({
        ...prev,
        email: user.email || '',
      }));
      setFormattedBirthday(birthdayFormattedForView);
    }
  }, [user]);

  const validatePasswordFormat = (password: string): string | null => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    if (password.length < minLength) return 'Mật khẩu phải có ít nhất 8 ký tự';
    if (!hasUppercase) return 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
    if (!hasLowercase) return 'Mật khẩu phải chứa ít nhất 1 chữ thường';
    if (!hasNumber) return 'Mật khẩu phải chứa ít nhất 1 số';
    if (!hasSpecialChar) return 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt';
    return null;
  };
  const handleAccountChangetouchedFields = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    setAccountInfo((prev) => ({ ...prev, [name]: value }));
    setTouchedFields((prev) => ({ ...prev, [name]: true }));

    const updatedErrors = { ...passwordErrors };

    if (name === 'password') {
      updatedErrors.password = value.trim()
        ? ''
        : 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (name === 'newPassword') {
      if (!value.trim()) {
        updatedErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
      } else if (value === accountInfo.password) {
        updatedErrors.newPassword = 'Mật khẩu mới không được trùng mật khẩu cũ';
      } else {
        const formatError = validatePasswordFormat(value);
        updatedErrors.newPassword = formatError || '';
      }
    }

    if (name === 'confirmPassword') {
      updatedErrors.confirmPassword =
        value !== accountInfo.newPassword ? 'Mật khẩu xác nhận không khớp' : '';
    }

    setPasswordErrors(updatedErrors);
  };

  const handleChangePassword = async () => {
    const { password, newPassword, confirmPassword } = accountInfo;

    const newErrors = {
      password: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    }

    if (password && newPassword && password === newPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được trùng mật khẩu cũ';
    }

    const passwordFormatError = validatePasswordFormat(newPassword);
    if (newPassword && passwordFormatError) {
      newErrors.newPassword = passwordFormatError;
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    // Nếu có bất kỳ lỗi nào
    if (Object.values(newErrors).some((msg) => msg !== '')) {
      setPasswordErrors(newErrors);
      return;
    }

    // Gửi request nếu không có lỗi
    try {
      await changePasswordProfile({
        oldPassword: password,
        newPassword,
        confirmPassword,
      });

      toast.success('Đổi mật khẩu thành công!');
      setAccountInfo({
        email: accountInfo.email,
        password: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsEditingAccount(false);
      setPasswordErrors({
        password: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Đổi mật khẩu thất bại!';

      if (msg === 'Mật khẩu cũ không đúng') {
        setTouchedFields((prev) => ({ ...prev, password: true }));
        setPasswordErrors((prev) => ({
          ...prev,
          password: msg,
        }));

        // Optional: focus lại vào input
        setTimeout(() => {
          const input = document.querySelector<HTMLInputElement>(
            'input[name="password"]',
          );
          input?.focus();
        }, 100);
      } else {
        toast.error(msg);
      }
    }
  };

  const handleSavePersonalInfo = async () => {
    const fullName = personalInfo.fullName.trim();
    const phone = personalInfo.phone.trim();
    const birthday = personalInfo.birthday;

    if (!fullName) {
      toast.error('Họ và tên không được để trống');
      return;
    }

    if (phone && !/^0\d{9,10}$/.test(phone)) {
      toast.error(
        'Số điện thoại không hợp lệ. Phải bắt đầu bằng số 0 và có 10 chữ số.',
      );
      return;
    }

    if (!birthday) {
      toast.error('Vui lòng chọn ngày sinh');
      return;
    }

    if (!user?._id) {
      toast.error('Không xác định được người dùng');
      return;
    }

    try {
      const payload = {
        username: fullName,
        phone,
        gender: personalInfo.gender,
        birthday,
      };

      await dispatch(
        updateUserProfile({ userId: user._id, data: payload }),
      ).unwrap();

      toast.success('Cập nhật thông tin thành công!');
      setIsEditingPersonal(false);
    } catch (err: any) {
      const msg = err?.message || 'Cập nhật thất bại!';

      if (msg.includes('không có quyền')) {
        toast.error('Bạn không được phép chỉnh sửa người dùng khác!');
      } else {
        toast.error(msg);
      }
    }
  };
  const handlePersonalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col bg-bodyBackground text-white font-sans">
      <BreadCrumbComponents />

      <Container className='flex gap-6 py-10'>
        <div className="w-1/3 hidden md:block">
          <ProfileSidebar />
        </div>

        <div className="flex-1 w-2/3 bg-bodyBackground p-10 border border-[#FFE0A0]">
          <UserLoyaltyTier />
          <h2 className="text-3xl font-restora font-bold text-white mb-8">
            Thông tin tài khoản
          </h2>

          <div className="space-y-10">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6 items-center">
                <p className="text-gray-400">Họ và tên</p>
                {isEditingPersonal ? (
                  <input
                    type="text"
                    name="fullName"
                    value={personalInfo.fullName}
                    onChange={handlePersonalChange}
                    className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
                  />
                ) : (
                  <p className="font-medium">{personalInfo.fullName}</p>
                )}

                <p className="text-gray-400">Số điện thoại</p>
                {isEditingPersonal ? (
                  <input
                    type="text"
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalChange}
                    placeholder="Chưa cập nhật"
                    className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
                  />
                ) : (
                  <p className="font-medium text-gray-400">
                    {personalInfo.phone || 'Chưa cập nhật'}
                  </p>
                )}

                <p className="text-gray-400">Giới tính</p>
                {isEditingPersonal ? (
                  <select
                    name="gender"
                    value={personalInfo.gender}
                    onChange={handlePersonalChange}
                    className="w-full bg-bodyBackground text-white border-b border-gray-500 appearance-none focus:outline-none focus:border-secondaryColor py-2 pr-6"
                  >
                    <option className="text-black" value="">
                      Chưa cập nhật
                    </option>
                    <option className="text-black" value="Nam">
                      Nam
                    </option>
                    <option className="text-black" value="Nữ">
                      Nữ
                    </option>
                    <option className="text-black" value="Khác">
                      Khác
                    </option>
                  </select>
                ) : (
                  <p className="font-medium text-gray-400">
                    {personalInfo.gender || 'Chưa cập nhật'}
                  </p>
                )}

                <p className="text-gray-400">Ngày sinh</p>
                {isEditingPersonal ? (
                  <input
                    type="date"
                    name="birthday"
                    value={personalInfo.birthday}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={handlePersonalChange}
                    className="w-full bg-transparent border-b border-gray-500 text-white focus:outline-none focus:border-secondaryColor py-2"
                  />
                ) : (
                  <p className="font-medium text-gray-400">
                    {formattedBirthday || 'Chưa cập nhật'}
                  </p>
                )}
              </div>

              <button
                onClick={
                  isEditingPersonal
                    ? handleSavePersonalInfo
                    : () => setIsEditingPersonal(true)
                }
                className="px-6 py-2 md:px-10 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase"
              >
                {isEditingPersonal ? 'Lưu' : 'Cập nhật'}
              </button>
            </div>

            <div className="border-t border-gray-600"></div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6 items-start">
                <p className="text-gray-400 mt-3">Email</p>
                <p className="font-medium mt-3">{accountInfo.email}</p>

                {!isEditingAccount && (
                  <>
                    <p className="text-gray-400 mt-3">Mật khẩu</p>
                    <p className="font-medium mt-3">**********</p>
                  </>
                )}

                {isEditingAccount && (
                  <>
                    <p className="text-gray-400">Mật khẩu hiện tại</p>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={accountInfo.password}
                        onChange={handleAccountChangetouchedFields}
                        placeholder="Nhập mật khẩu hiện tại"
                        className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2 pr-10"
                      />
                      <span
                        className="absolute right-2 top-2 text-xl text-white cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </span>
                      {touchedFields.password && (
                        <span className="text-red-400 text-sm mt-1 block">
                          {isCheckingPassword
                            ? 'Đang kiểm tra...'
                            : passwordErrors.password}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-400">Mật khẩu mới</p>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={accountInfo.newPassword}
                        onChange={handleAccountChangetouchedFields}
                        placeholder="Nhập mật khẩu mới"
                        className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2 pr-10"
                      />
                      <span
                        className="absolute right-2 top-2 text-xl text-white cursor-pointer"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </span>
                      {touchedFields.newPassword &&
                        passwordErrors.newPassword && (
                          <span className="text-red-400 text-sm mt-1 block">
                            {passwordErrors.newPassword}
                          </span>
                        )}
                    </div>

                    <p className="text-gray-400">Xác nhận mật khẩu mới</p>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={accountInfo.confirmPassword}
                        onChange={handleAccountChangetouchedFields}
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2 pr-10"
                      />
                      <span
                        className="absolute right-2 top-2 text-xl text-white cursor-pointer"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </span>
                      {touchedFields.confirmPassword &&
                        passwordErrors.confirmPassword && (
                          <span className="text-red-400 text-sm mt-1 block">
                            {passwordErrors.confirmPassword}
                          </span>
                        )}
                    </div>
                  </>
                )}
              </div>

              <button
                disabled={changingPassword}
                onClick={
                  isEditingAccount
                    ? handleChangePassword
                    : () => setIsEditingAccount(true)
                }
                className={`px-6 py-2 md:px-10 border border-secondaryColor transition uppercase ${
                  changingPassword ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {changingPassword
                  ? 'Đang lưu...'
                  : isEditingAccount
                    ? 'Lưu'
                    : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProfilePage;
