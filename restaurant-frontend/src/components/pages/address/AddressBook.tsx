import React, { useState } from 'react';

interface Address {
  name: string;
  phone: string;
  address: string;
}

interface AddressBookProps {
  defaultAddress: Address;
  otherAddresses: Address[];
}

const AddressBook: React.FC<AddressBookProps> = ({
  defaultAddress,
  otherAddresses,
}) => {
  const [isEditingDefault, setIsEditingDefault] = useState(false);
  const [defaultForm, setDefaultForm] = useState(defaultAddress);

  const [editingOtherIndex, setEditingOtherIndex] = useState<number | null>(null);
  const [otherForms, setOtherForms] = useState(otherAddresses);

  const handleDefaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultForm({ ...defaultForm, [e.target.name]: e.target.value });
  };

  const handleOtherChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newAddresses = [...otherForms];
    newAddresses[index] = {
      ...newAddresses[index],
      [e.target.name]: e.target.value,
    };
    setOtherForms(newAddresses);
  };

  return (
    <div className="flex-1 bg-bodyBackground p-4 md:p-10 border border-[#FFE0A0] text-white font-sans">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-restora font-bold text-white">
          Sổ địa chỉ
        </h2>
        <button
          className="w-7/12 px-1 py-2 lg:w-auto lg:px-8 md:px-2 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase text-sm md:text-base"
        >
          Thêm địa chỉ mới
        </button>
      </div>

      <div className="space-y-6 mb-10">
        <h3 className="text-lg md:text-xl font-semibold mb-4">Địa chỉ mặc định</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <p className="text-gray-400">Họ và tên</p>
          {isEditingDefault ? (
            <input
              name="name"
              value={defaultForm.name}
              onChange={handleDefaultChange}
              className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
            />
          ) : (
            <p className="font-medium">{defaultForm.name}</p>
          )}

          <p className="text-gray-400">Số điện thoại</p>
          {isEditingDefault ? (
            <input
              name="phone"
              value={defaultForm.phone}
              onChange={handleDefaultChange}
              className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
            />
          ) : (
            <p className="font-medium">{defaultForm.phone}</p>
          )}

          <p className="text-gray-400">Địa chỉ</p>
          {isEditingDefault ? (
            <input
              name="address"
              value={defaultForm.address}
              onChange={handleDefaultChange}
              className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
            />
          ) : (
            <p className="font-medium">{defaultForm.address}</p>
          )}
        </div>

        <button
          onClick={() => setIsEditingDefault(!isEditingDefault)}
          className="px-6 py-2 md:px-10 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase text-sm md:text-base"
        >
          {isEditingDefault ? 'Lưu' : 'Cập nhật'}
        </button>
      </div>

      <div className="border-t border-gray-600 mb-10"></div>


      <div className="space-y-6">
        <h3 className="text-lg md:text-xl font-semibold mb-4">Các địa chỉ khác</h3>

        {otherForms.map((addr, index) => (
          <div key={index} className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
              <p className="text-gray-400">Họ và tên</p>
              {editingOtherIndex === index ? (
                <input
                  name="name"
                  value={addr.name}
                  onChange={(e) => handleOtherChange(index, e)}
                  className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
                />
              ) : (
                <p className="font-medium">{addr.name}</p>
              )}

              <p className="text-gray-400">Số điện thoại</p>
              {editingOtherIndex === index ? (
                <input
                  name="phone"
                  value={addr.phone}
                  onChange={(e) => handleOtherChange(index, e)}
                  className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
                />
              ) : (
                <p className="font-medium">{addr.phone}</p>
              )}

              <p className="text-gray-400">Địa chỉ</p>
              {editingOtherIndex === index ? (
                <input
                  name="address"
                  value={addr.address}
                  onChange={(e) => handleOtherChange(index, e)}
                  className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
                />
              ) : (
                <p className="font-medium">{addr.address}</p>
              )}
            </div>

            <button
              onClick={() =>
                setEditingOtherIndex(editingOtherIndex === index ? null : index)
              }
              className="px-6 py-2 md:px-10 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase text-sm md:text-base"
            >
              {editingOtherIndex === index ? 'Lưu' : 'Cập nhật'}
            </button>

            {index < otherForms.length - 1 && (
              <div className="border-t border-gray-600 my-10"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressBook;
