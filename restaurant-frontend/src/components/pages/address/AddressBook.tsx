import React, { useEffect, useState } from 'react';
import { AddressInput } from './AddressInput';
import { AddAddressModal } from './AddAddressModal';
import { useUserAddresses } from '@hooks/useAddress';
import { deleteAddress } from '@api/AddressApi';
import { UpdateAddressModal } from './UpdateAddressModal';
import { toast } from 'react-toastify';

const LIMIT_TOAST_ID = 'limit-toast';

interface Address {
  name: string;
  phone: string;
  street_address: string;
  id?: string; // để lưu id xoá nếu cần
}

const AddressBook: React.FC = () => {
  const { data, error, refetch } = useUserAddresses();

  const [defaultForm, setDefaultForm] = useState<Address>({
    name: '',
    phone: '',
    street_address: '',
  });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
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
        name: defaultAddr.full_name,
        phone: defaultAddr.phone,
        street_address: `${defaultAddr.street_address}, ${defaultAddr.ward}, ${defaultAddr.district}, ${defaultAddr.province}`,
        id: defaultAddr.id,
      });
    }

    const formattedOthers = others.map((addr) => ({
      name: addr.full_name,
      phone: addr.phone,
      street_address: `${addr.street_address}, ${addr.ward}, ${addr.district}, ${addr.province}`,
      id: addr.id,
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
          setDefaultForm({ name: '', phone: '', street_address: '' });
        }
        refetch();
      } catch {
        toast.error('Xoá địa chỉ thất bại!');
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
              value={defaultForm.street_address}
              onChange={(e) =>
                setDefaultForm({
                  ...defaultForm,
                  street_address: e.target.value,
                })
              }
              onSelectLocation={(lat, lon, street_address) =>
                setDefaultForm({ ...defaultForm, street_address })
              }
              district={defaultForm.street_address.split(',')[2]?.trim() || ''}
              ward={defaultForm.street_address.split(',')[1]?.trim() || ''}
              province={
                defaultForm.street_address.split(',')[3]?.trim() ||
                'TP. Hồ Chí Minh'
              }
            />
          ) : (
            <p className="font-medium">{defaultForm.street_address}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              const [street, ward, district, province] =
                defaultForm.street_address.split(',').map((s) => s.trim());

              setSelectedAddress({
                ...defaultForm,
                street_address: street,
                ward,
                district,
                province,
                is_default: true,
              });

              setIsUpdateModalOpen(true);
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
                  onSelectLocation={(lat, lon, street_address) => {
                    const newAddresses = [...otherForms];
                    newAddresses[index] = {
                      ...newAddresses[index],
                      street_address,
                    };
                    setOtherForms(newAddresses);
                  }}
                  district={
                    defaultForm.street_address.split(',')[2]?.trim() || ''
                  }
                  ward={defaultForm.street_address.split(',')[1]?.trim() || ''}
                  province={
                    defaultForm.street_address.split(',')[3]?.trim() ||
                    'TP. Hồ Chí Minh'
                  }
                />
              ) : (
                <p className="font-medium">{addr.street_address}</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  const [street, ward, district, province] = addr.street_address
                    .split(',')
                    .map((s) => s.trim());
                  setSelectedAddress({
                    ...addr,
                    street_address: street,
                    ward,
                    district,
                    province,
                  });
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
            refetch(); // Làm mới danh sách
            setIsUpdateModalOpen(false);
            setSelectedAddress(null);
          }}
        />
      )}
    </div>
  );
};

export default AddressBook;
