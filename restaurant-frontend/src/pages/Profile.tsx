import React, { useState } from 'react';
import ProfileSidebar from '../components/pages/proflie/ProfileSidebar';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';

const ProfilePage = () => {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Nguyễn Thanh Tiến',
    phone: '',
    gender: '',
    birthday: '',
  });

  const [accountInfo, setAccountInfo] = useState({
    email: 'tient1104@gmail.com',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col bg-bodyBackground text-white font-sans">
        <BreadCrumbComponents/>
  
      <div className="w-[1300px] max-w-[1300px] mx-auto flex px-8 py-12 gap-8">
        <div className="w-1/3 hidden md:block">
          <ProfileSidebar />
        </div>
  
        <div className="flex-1 bg-bodyBackground p-10 border border-[#FFE0A0]">
          <h2 className="text-3xl font-restora font-bold text-white mb-8">Thông tin tài khoản</h2>
  
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
                  <p className="font-medium text-gray-400">{personalInfo.phone || 'Chưa cập nhật'}</p>
                )}
  
                <p className="text-gray-400">Giới tính</p>
                {isEditingPersonal ? (
                 <select
                 name="gender"
                 value={personalInfo.gender}
                 onChange={handlePersonalChange}
                 className="w-full bg-bodyBackground text-white border-b border-gray-500 appearance-none focus:outline-none focus:border-secondaryColor py-2 pr-6"
               >
                 <option className="text-black" value="">Chưa cập nhật</option>
                 <option className="text-black" value="Nam">Nam</option>
                 <option className="text-black" value="Nữ">Nữ</option>
                 <option className="text-black" value="Khác">Khác</option>
               </select>
                ) : (
                  <p className="font-medium text-gray-400">{personalInfo.gender || 'Chưa cập nhật'}</p>
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
                  <p className="font-medium text-gray-400">{personalInfo.birthday || 'Chưa cập nhật'}</p>
                )}
              </div>
  
              <button
                onClick={() => setIsEditingPersonal(!isEditingPersonal)}
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
                onClick={() => setIsEditingAccount(!isEditingAccount)}
                className="px-6 py-2 md:px-10 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase "
              >
                {isEditingAccount ? 'Lưu' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
