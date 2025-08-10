

import React, { useEffect, useState } from 'react';
import { AddressInput } from './AddressInput';
import { AddAddressModal } from './AddAddressModal';
import { useDistricts, useUserAddresses } from '@hooks/useAddress';
import { deleteAddress } from '@api/AddressApi';
import { UpdateAddressModal } from './UpdateAddressModal';
import { toast } from 'react-toastify';

const LIMIT_TOAST_ID = 'limit-toast';

interface Address {
  id: string;
  name: string;
  phone: string;
  street_address: string;
  ward?: string;
  district?: string;
  province?: string;
  is_default?: boolean;
  full_name?: string;
}
const getProvinceName = (code?: string) => {
  if (!code) return '';
  if (code === '79') return 'TP. Hồ Chí Minh';
  return code;
};
const AddressBook: React.FC = () => {
  const [selectedProvinceCode] = useState('79');
  const { data, error, refetch } = useUserAddresses();
  const { districts } = useDistricts(selectedProvinceCode);
  const [defaultForm, setDefaultForm] = useState<Address>({
    id: '',
    name: '',
    phone: '',
    street_address: '',
    ward: '',
    district: '',
    province: selectedProvinceCode,
  });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  console.log('Selected address:', selectedAddress);

  const [otherForms, setOtherForms] = useState<Address[]>([]);
  const [isEditingDefault] = useState(false);
  const [editingOtherIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalAddresses = Array.isArray(data) ? data.length : 0;

  useEffect(() => {
    if (!data || data.length === 0) return;

    const defaultAddr = data.find((addr) => addr.is_default);
    const others = data.filter((addr) => !addr.is_default);

    if (defaultAddr) {
      setDefaultForm({
        id: defaultAddr.id,
        name: defaultAddr.full_name,
        phone: defaultAddr.phone,
        street_address: defaultAddr.street_address,
        ward: defaultAddr.ward || '',
        district: defaultAddr.district || '',
        province: selectedProvinceCode || '',
        is_default: true,
      });
    }

    const formattedOthers = others.map((addr) => ({
      id: addr.id,
      name: addr.full_name,
      phone: addr.phone,
      street_address: addr.street_address,
      ward: addr.ward || '',
      district: addr.district || '',
      province: addr.province || '',
      is_default: false,
    }));

    setOtherForms(formattedOthers);
  }, [data]);

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

  const showDeleteConfirmToast = (onConfirm: () => void) => {
    toast.dismiss();

    toast.info(
      ({ closeToast }) => (
        <div className="max-w-[360px] text-white text-sm">
          <div className="flex items-start gap-3">
            <div className="text-red-400 text-lg pt-1">⚠️</div>
            <div className="flex-1">
              <p className="font-semibold mb-2 leading-snug">
                Bạn có chắc chắn muốn xoá địa chỉ này?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeToast}
                  className="px-3 py-1 border border-gray-400 text-gray-300 rounded hover:bg-gray-700"
                >
                  Huỷ
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    closeToast?.();
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Xoá
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        icon: false,
        position: 'top-center',
        autoClose: false,
        closeButton: false,
        draggable: false,
        closeOnClick: false,
        hideProgressBar: true,
        theme: 'dark',
      },
    );
  };

  const handleDelete = (id: string | undefined) => {
    if (!id) return;

    showDeleteConfirmToast(async () => {
      try {
        await deleteAddress(id);
        toast.success('Đã xoá địa chỉ!');
        if (data.length === 1) {
          setDefaultForm({
            id: '',
            name: '',
            phone: '',
            street_address: '',
            ward: '',
            district: '',
            province: selectedProvinceCode,
          });
        }
        refetch();
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data && typeof err.response.data.error === 'string' && err.response.data.error.includes('quá nhiều yêu cầu')) {
          toast.error('Bạn đang gửi quá nhiều yêu cầu. Vui lòng thử lại sau vài phút.');
        } else {
          toast.error('Xoá địa chỉ thất bại!');
        }
      }
    });
  };

  if (error) return <p className="text-red-400">Lỗi khi tải địa chỉ</p>;

  if (Array.isArray(data) && data.length === 0) {
    return (
      <div className="flex-1 bg-bodyBackground p-4 md:p-10 border border-[#FFE0A0] text-white font-sans">
        <h2 className="text-2xl md:text-3xl font-restora font-bold text-white mb-6">
          Sổ địa chỉ
        </h2>
        <p className="text-gray-400 italic">Hiện chưa có địa chỉ nào.</p>
        <button
          onClick={() => {
            if (totalAddresses >= 5) {
              if (!toast.isActive(LIMIT_TOAST_ID)) {
                toast.warn('Bạn chỉ có thể lưu tối đa 5 địa chỉ!', {
                  toastId: LIMIT_TOAST_ID,
                });
              }
              return;
            }

            setIsModalOpen(true);
          }}
          className="mt-6 px-6 py-2 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase text-sm md:text-base"
        >
          Thêm địa chỉ mới
        </button>

        <AddAddressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            toast.success('Thêm địa chỉ thành công!');
            refetch();
            setIsModalOpen(false);
          }}
          total={totalAddresses}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-bodyBackground p-4 md:p-10 border border-[#FFE0A0] text-white font-sans">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-restora font-bold text-white">
          Sổ địa chỉ
        </h2>
        <button
          onClick={() => {
            if (totalAddresses >= 5) {
              if (!toast.isActive(LIMIT_TOAST_ID)) {
                toast.warn('Bạn chỉ có thể lưu tối đa 5 địa chỉ!', {
                  toastId: LIMIT_TOAST_ID,
                });
              }
              return;
            }

            setIsModalOpen(true);
          }}
          className="w-7/12 px-1 py-2 lg:w-auto lg:px-8 md:px-2 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase text-sm md:text-base"
        >
          Thêm địa chỉ mới
        </button>
      </div>

      {/* Địa chỉ mặc định */}
      <div className="space-y-6 mb-10">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Địa chỉ mặc định
        </h3>
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
              value={`$${defaultForm.street_address}${defaultForm.ward ? ", " + defaultForm.ward : ""}${defaultForm.district ? ", " + defaultForm.district : ""}${defaultForm.province ? ", " + defaultForm.province : ""}`}
              onChange={(e) => {
                const parts = e.target.value.split(',').map((s) => s.trim());
                setDefaultForm({
                  ...defaultForm,
                  street_address: parts[0] || '',
                  ward: parts[1] || '',
                  district: parts[2] || '',
                  province: selectedProvinceCode,
                });
              }}

            />
          ) : (
            <p className="font-medium">
              {defaultForm.street_address}
              {defaultForm.ward ? `, ${defaultForm.ward}` : ''}
              {defaultForm.district ? `, ${defaultForm.district}` : ''}
              {defaultForm.province ? `, ${getProvinceName(defaultForm.province)}` : ''}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              const addr = data.find((a) => a.id === defaultForm.id);
              console.log("Địa chỉ mặc định:", addr);
              
              if (addr) {
                const selected = {
                  id: addr.id,
                  name: addr.full_name,
                  phone: addr.phone,
                  street_address: addr.street_address,
                  ward: addr.ward || '',
                  district: addr.district || '',
                  province: addr.province || 'TP. Hồ Chí Minh',
                  is_default: true,
                };
                console.log('Địa chỉ được chọn:', selected);

                setSelectedAddress(selected);
                setIsUpdateModalOpen(true);
              }
            }}
            className="px-6 py-2 md:px-10 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase text-sm md:text-base"
          >
            Cập nhật
          </button>
          <span className="text-xs md:text-sm text-red-500 border border-red-500 rounded px-2 h-10 flex items-center justify-center ml-1">
            Mặc định
          </span>
          {data.length === 1 && (
            <button
              onClick={() => handleDelete(defaultForm.id)}
              className="px-4 py-1 text-sm border border-red-400 text-red-400 hover:bg-red-500 hover:text-white rounded transition ml-1"
            >
              Xoá
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-gray-600 mb-10"></div>

      {/* Địa chỉ khác */}
      <div className="space-y-6">
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Các địa chỉ khác
        </h3>
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
                  value={addr.street_address}
                  onChange={(e) => {
                    const newAddresses = [...otherForms];
                    newAddresses[index] = {
                      ...newAddresses[index],
                      street_address: e.target.value,
                    };
                    setOtherForms(newAddresses);
                  }}
                />
              ) : (
                <p className="font-medium">
                  {addr.street_address}
                  {addr.ward ? `, ${addr.ward}` : ''}
                  {addr.district ? `, ${addr.district}` : ''}
                  {addr.province ? `, ${getProvinceName(addr.province)}` : ''}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  const selected = {
                    id: addr.id,
                    name: addr.full_name || '',
                    phone: addr.phone,
                    street_address: addr.street_address,
                    ward: addr.ward || '',
                    district: addr.district || '',
                    province: addr.province || 'TP. Hồ Chí Minh',
                    is_default: false,
                  };
                  console.log('Truyền sang UpdateAddressModal:', selected);
                  setSelectedAddress(selected);
                  setIsUpdateModalOpen(true);
                }}
                className="px-6 py-2 md:px-10 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase text-sm md:text-base"
              >
                Cập nhật
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                className="px-4 py-1 text-sm border border-red-400 text-red-400 hover:bg-red-500 hover:text-white rounded transition"
              >
                Xoá
              </button>
            </div>

            {index < otherForms.length - 1 && (
              <div className="border-t border-gray-600 my-10"></div>
            )}
          </div>
        ))}
      </div>

      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {
          toast.success('Thêm địa chỉ thành công!');
          refetch();
          setIsModalOpen(false);
        }}
        total={totalAddresses}
      />

      {selectedAddress && (
        <UpdateAddressModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedAddress(null);
          }}
          address={selectedAddress}
          onSave={() => {
            toast.success('Cập nhật địa chỉ thành công!');
            refetch();
            setIsUpdateModalOpen(false);
            setSelectedAddress(null);
          }}
        />
      )}
    </div>
  );
};

export default AddressBook;
