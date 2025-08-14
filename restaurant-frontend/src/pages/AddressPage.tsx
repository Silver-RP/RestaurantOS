import React from 'react';
import AddressBook from '../components/pages/address/AddressBook';
import ProfileSidebar from '../components/pages/proflie/ProfileSidebar';
import Container from '../components/common/Container';

const AddressPage: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-bodyBackground font-sans">
        <Container className="flex gap-6 sm:py-10">
          <div className="w-1/3 hidden md:block">
            <ProfileSidebar />
          </div>
          <div className="flex-1 w-2/3 ">
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
                  address:
                    'Đối diện Lotte Lê Văn Lương, Quận Gò Vấp, Hồ Chí Minh',
                  coordinates: { lat: 10.8231, lon: 106.6297 },
                  addressType: 'home',
                },
              ]}
            />
          </div>
        </Container>
      </div>
    </>
  );
};

export default AddressPage;
