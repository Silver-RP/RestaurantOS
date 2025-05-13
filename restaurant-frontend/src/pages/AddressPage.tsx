import React from 'react';
import AddressBook from '../components/pages/address/AddressBook';
import ProfileSidebar from '../components/pages/proflie/ProfileSidebar';
import BreadCrumbComponents from '../components/common/BreadCrumbComponents';

const AddressPage: React.FC = () => {
  

  return (
    <>
      <BreadCrumbComponents />
      <div className="min-h-screen bg-bodyBackground py-12 font-sans">
        <div className="w-mainContainer lg:w-mainContainer mx-auto flex flex-col md:w-container95 md:flex-row gap-8">
          <div className="w-full md:w-[280px] lg:w-1/3">
            <ProfileSidebar />
          </div>

          <div className="flex-1">
            <AddressBook
              defaultAddress={{
                name: 'Nguyễn Thanh Tiến',
                phone: '0376491104',
                address: 'C10.07 Tòa C chung cư Sadora, Quận 2, Hồ Chí Minh',
                coordinates: { lat: 10.7769, lon: 106.7009 },
                addressType: 'home',
              }}
              otherAddresses={[
                {
                  name: 'Nguyễn Ngọc Mỹ',
                  phone: '0378217272',
                  address: 'Đối diện Lotte Lê Văn Lương, Quận Gò Vấp, Hồ Chí Minh',
                  coordinates: { lat: 10.8231, lon: 106.6297 },
                  addressType: 'home',
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressPage;