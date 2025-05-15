import React, { useState } from 'react';
import ProfileSidebar from '../components/pages/proflie/ProfileSidebar';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateUserInfo } from '@/redux/feature/user/userAction';
import { toast } from 'react-toastify';
import { useChangePasswordProfile } from '@/hooks/useAuth';

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { changePasswordProfile, loading: changingPassword } =
    useChangePasswordProfile();

  const { user } = useSelector((state: RootState) => state.user);
  const [formattedBirthday, setFormattedBirthday] = useState('');

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
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

  const handleChangePassword = async () => {
    const { password, newPassword, confirmPassword } = accountInfo;

    // ==== Kiểm tra rỗng ====
    if (!password.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin mật khẩu');
      return;
    }

    // ==== Kiểm tra trùng mật khẩu cũ ====
    if (password === newPassword) {
      toast.error('Mật khẩu mới không được trùng mật khẩu cũ');
      return;
    }

    // ==== Kiểm tra độ mạnh mật khẩu mới ====
    const passwordFormatError = validatePasswordFormat(newPassword);
    if (passwordFormatError) {
      toast.error(passwordFormatError);
      return;
    }

    // ==== Xác nhận mật khẩu ====
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    // ==== Gửi request đổi mật khẩu ====
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
    } catch (e: any) {
      const errorMessage =
        e?.response?.data?.message || 'Đổi mật khẩu thất bại!';
      toast.error(errorMessage);
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
        'Số điện thoại không hợp lệ. Phải bắt đầu bằng số 0 và có 10-11 chữ số.',
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
        updateUserInfo({ userId: user._id, data: payload }),
      ).unwrap();

      toast.success('Cập nhật thành công!');
      setIsEditingPersonal(false);
    } catch (err: any) {
      const errorMessage = err?.message || 'Cập nhật thất bại!';
      toast.error(errorMessage);
    }
  };
  const handlePersonalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col bg-bodyBackground text-white font-sans">
      <BreadCrumbComponents />

      <div className="w-[1300px] max-w-[1300px] mx-auto flex px-8 py-12 gap-8">
        <div className="w-1/3 hidden md:block">
          <ProfileSidebar />
        </div>

        <div className="flex-1 bg-bodyBackground p-10 border border-[#FFE0A0]">
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
                    type="number"
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
                    <input
                      type="password"
                      name="password"
                      value={accountInfo.password}
                      onChange={handleAccountChange}
                      placeholder="Nhập mật khẩu hiện tại"
                      className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
                    />

                    <p className="text-gray-400">Mật khẩu mới</p>
                    <input
                      type="password"
                      name="newPassword"
                      value={accountInfo.newPassword}
                      onChange={handleAccountChange}
                      placeholder="Nhập mật khẩu mới"
                      className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
                    />

                    <p className="text-gray-400">Xác nhận mật khẩu mới</p>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={accountInfo.confirmPassword}
                      onChange={handleAccountChange}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
                    />
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
      </div>
    </div>
  );
};

export default ProfilePage;
