import React, { useState } from 'react';
import { AddressInput } from './AddressInput';
import { AddAddressModal } from './AddAddressModal';

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState<Address>({
    name: '',
    phone: '',
    address: '',
  });

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

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddressForm({ ...newAddressForm, [e.target.name]: e.target.value });
  };

  const handleAddNewAddress = () => {
    setOtherForms([...otherForms, newAddressForm]);
    setIsModalOpen(false);
  };

  const cancelDefaultEdit = () => {
    setDefaultForm(defaultAddress); // Reset to initial default address
    setIsEditingDefault(false);
  };

  const cancelOtherEdit = (index: number) => {
    const originalAddress = otherAddresses[index];
    const updatedAddresses = [...otherForms];
    updatedAddresses[index] = originalAddress; // Reset to original address
    setOtherForms(updatedAddresses);
    setEditingOtherIndex(null); // Stop editing
  };

  return (
    <div className="flex-1 bg-bodyBackground p-4 md:p-10 border border-[#FFE0A0] text-white font-sans">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-restora font-bold text-white">
          Sổ địa chỉ
        </h2>
        <button
          onClick={() => setIsModalOpen(true)} // Mở modal khi click
          className="w-7/12 px-1 py-2 lg:w-auto lg:px-8 md:px-2 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase text-sm md:text-base"
        >
          Thêm địa chỉ mới
        </button>
      </div>

      {/* Địa chỉ mặc định */}
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
            <AddressInput
              value={defaultForm.address}
              onChange={(e) => {
                setDefaultForm({ ...defaultForm, address: e.target.value });
              }}
              onSelectLocation={(lat, lon, address) => {
                setDefaultForm({ ...defaultForm, address });
              }}
            />
          ) : (
            <p className="font-medium">{defaultForm.address}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              if (isEditingDefault) {
                // Gọi API lưu nếu cần
                console.log('Lưu địa chỉ mặc định:', defaultForm);
              }
              setIsEditingDefault(!isEditingDefault);
            }}
            className="px-6 py-2 md:px-10 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase text-sm md:text-base"
          >
            {isEditingDefault ? 'Lưu' : 'Cập nhật'}
          </button>

          {isEditingDefault && (
            <button
              onClick={cancelDefaultEdit}
              className="px-6 py-2 md:px-10 border border-secondaryColor hover:text-secondaryColor hover:bg-bodyBackground text-white transition uppercase text-sm md:text-base"
            >
              Hủy
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-gray-600 mb-10"></div>

      {/* Địa chỉ khác */}
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
                <AddressInput
                  value={addr.address}
                  onChange={(e) => {
                    const newAddresses = [...otherForms];
                    newAddresses[index] = { ...newAddresses[index], address: e.target.value };
                    setOtherForms(newAddresses);
                  }}
                  onSelectLocation={(lat, lon, address) => {
                    const newAddresses = [...otherForms];
                    newAddresses[index] = { ...newAddresses[index], address };
                    setOtherForms(newAddresses);
                  }}
                />
              ) : (
                <p className="font-medium">{addr.address}</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (editingOtherIndex === index) {
                    console.log('Lưu địa chỉ khác:', otherForms[index]);
                    setEditingOtherIndex(null);
                  } else {
                    setEditingOtherIndex(index);
                  }
                }}
                className={`px-6 py-2 md:px-10 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase text-sm md:text-base ${
                  editingOtherIndex !== null && editingOtherIndex !== index ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={editingOtherIndex !== null && editingOtherIndex !== index} // Disable button if another address is being edited
              >
                {editingOtherIndex === index ? 'Lưu' : 'Cập nhật'}
              </button>

              {editingOtherIndex === index && (
                <button
                  onClick={() => cancelOtherEdit(index)}
                  className="px-6 py-2 md:px-10 border border-secondaryColor hover:text-secondaryColor hover:bg-bodyBackground text-white transition uppercase text-sm md:text-base"
                >
                  Hủy
                </button>
              )}
            </div>

            {index < otherForms.length - 1 && (
              <div className="border-t border-gray-600 my-10"></div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Thêm địa chỉ mới */}
      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddNewAddress}
      />
    </div>
  );
};

export default AddressBook;
