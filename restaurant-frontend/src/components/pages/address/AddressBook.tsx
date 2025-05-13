import React, { useEffect, useState } from 'react';
import { AddressInput } from './AddressInput';
import { AddAddressModal } from './AddAddressModal';
<<<<<<< HEAD
import { useUserAddresses } from '@hooks/useAddress';
import { deleteAddress } from '@api/AddressApi';
import { UpdateAddressModal } from './UpdateAddressModal';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
=======
import { MapDisplay } from './MapDisplay';
>>>>>>> cc490501bd56f30ede24bfecf488186d74867939

interface Address {
  name: string;
  phone: string;
<<<<<<< HEAD
  street_address: string;
  id?: string; // để lưu id xoá nếu cần
=======
  address: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  addressType?: string;
>>>>>>> cc490501bd56f30ede24bfecf488186d74867939
}

const AddressBook: React.FC = () => {
  const { data, loading, error, refetch } = useUserAddresses();
  console.log('📦 Address data:', data);

<<<<<<< HEAD
  const [defaultForm, setDefaultForm] = useState<Address>({
    name: '',
    phone: '',
    street_address: '',
=======
const AddressBook: React.FC<AddressBookProps> = ({
  defaultAddress,
  otherAddresses,
}) => {
  const [isEditingDefault, setIsEditingDefault] = useState(false);
  const [defaultForm, setDefaultForm] = useState<Address>({
    ...defaultAddress,
    coordinates: defaultAddress.coordinates || { lat: 10.7769, lon: 106.7009 }, // Default coordinates for Ho Chi Minh City
    addressType: defaultAddress.addressType || 'home', // Default address type if not provided
  });
  const [editingOtherIndex, setEditingOtherIndex] = useState<number | null>(null);
  const [otherForms, setOtherForms] = useState<Address[]>(
    otherAddresses.map(addr => ({
      ...addr,
      coordinates: addr.coordinates || { lat: 10.7769, lon: 106.7009 }, // Default coordinates for Ho Chi Minh City
      addressType: addr.addressType || 'other', // Default address type if not provided
    }))
  );
  // State to track if currently editing address should become default
  const [setAsDefaultOnSave, setSetAsDefaultOnSave] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for showing map
  const [showMap, setShowMap] = useState<{
    show: boolean;
    lat: number;
    lon: number;
    address: string;
  }>({
    show: false,
    lat: 10.7769,
    lon: 106.7009,
    address: '',
>>>>>>> cc490501bd56f30ede24bfecf488186d74867939
  });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
  const [otherForms, setOtherForms] = useState<Address[]>([]);
  const [isEditingDefault, setIsEditingDefault] = useState(false);
  const [editingOtherIndex, setEditingOtherIndex] = useState<number | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const defaultAddr = data.find((addr) => addr.is_default);
    const others = data.filter((addr) => !addr.is_default);

    if (defaultAddr) {
      setDefaultForm({
        name: defaultAddr.full_name,
        phone: defaultAddr.phone,
        street_address: `${defaultAddr.street_address}, ${defaultAddr.ward}, ${defaultAddr.district}, ${defaultAddr.province}`,
        id: defaultAddr.id, // 👈 Thêm dòng này
      });
    }

    const formattedOthers = others.map((addr) => ({
      name: addr.full_name,
      phone: addr.phone,
      street_address: `${addr.street_address}, ${addr.ward}, ${addr.district}, ${addr.province}`,
      id: addr.id, // ✅ đúng key
    }));

    setOtherForms(formattedOthers);
  }, [data]);

  const handleDefaultChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDefaultForm({ ...defaultForm, [e.target.name]: e.target.value });
  };

  const handleOtherChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const newAddresses = [...otherForms];
    newAddresses[index] = {
      ...newAddresses[index],
      [e.target.name]: e.target.value,
    };
    setOtherForms(newAddresses);
  };

<<<<<<< HEAD
=======
  const handleAddNewAddress = (
    address: string,
    lat: number,
    lon: number,
    name: string,
    phone: string,
    addressType: string,
  ) => {
    const newAddress: Address = {
      name,
      phone,
      address,
      coordinates: { lat, lon },
      addressType
    };
    
    setOtherForms([...otherForms, newAddress]);
  };

  const deleteAddress = (index: number) => {
    const newAddresses = [...otherForms];
    newAddresses.splice(index, 1);
    setOtherForms(newAddresses);
  };

>>>>>>> cc490501bd56f30ede24bfecf488186d74867939
  const cancelDefaultEdit = () => {
    setIsEditingDefault(false);
    setShowMap({ show: false, lat: 10.7769, lon: 106.7009, address: '' });
  };
  const showDeleteConfirmToast = (onConfirm: () => void) => {
    toast.dismiss(); // Đóng mọi toast hiện tại

<<<<<<< HEAD
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
        icon: false, // ❌ bỏ icon mặc định
        position: 'top-center',
        autoClose: false,
        closeButton: false,
        draggable: false,
        closeOnClick: false,
        hideProgressBar: true,
        theme: 'dark',
      },
    );
=======
  const cancelOtherEdit = (index: number) => {
    const originalAddress = otherAddresses[index];
    const updatedAddresses = [...otherForms];
    updatedAddresses[index] = originalAddress; // Reset to original address
    setOtherForms(updatedAddresses);
    setEditingOtherIndex(null); // Stop editing
    setSetAsDefaultOnSave(false); // Reset checkbox khi hủy chỉnh sửa
    setShowMap({ show: false, lat: 10.7769, lon: 106.7009, address: '' });
  };

  const getAddressTypeLabel = (type: string) => {
    switch(type) {
      case 'home':
        return 'Nhà riêng';
      case 'office':
        return 'Văn phòng';
      default:
        return 'Khác';
    }
  };

  // Function to set an address as default
  const setAsDefault = (index: number) => {
    // Get the address we want to make default
    const newDefaultAddress = otherForms[index];
    
    // Add current default address to other addresses list
    const newOtherForms = [...otherForms];
    newOtherForms.splice(index, 1); // Remove the one that will become default
    newOtherForms.push({...defaultForm}); // Add current default to others
    
    // Update states
    setDefaultForm(newDefaultAddress);
    setOtherForms(newOtherForms);
    
    // Reset any editing states
    setIsEditingDefault(false);
    setEditingOtherIndex(null);
    setShowMap({ show: false, lat: 10.7769, lon: 106.7009, address: '' });
    
    console.log('New default address set:', newDefaultAddress);
>>>>>>> cc490501bd56f30ede24bfecf488186d74867939
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
          onClick={() => setIsModalOpen(true)}
          className="mt-6 px-6 py-2 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase text-sm md:text-base"
        >
          Thêm địa chỉ mới
        </button>

        <AddAddressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            refetch();
            setIsModalOpen(false);
          }}
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
          onClick={() => setIsModalOpen(true)}
          className="w-7/12 px-1 py-2 lg:w-auto lg:px-8 md:px-2 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase text-sm md:text-base"
        >
          Thêm địa chỉ mới
        </button>
      </div>

      {/* Địa chỉ mặc định */}
      <div className="space-y-6 mb-10">
<<<<<<< HEAD
        <h3 className="text-lg md:text-xl font-semibold mb-4">
          Địa chỉ mặc định
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
=======
        <h3 className="text-lg md:text-xl font-semibold mb-4">Địa chỉ mặc định</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
>>>>>>> cc490501bd56f30ede24bfecf488186d74867939
          <p className="text-gray-400">Họ và tên</p>
          <div className="min-h-10 flex items-center">
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
          </div>

          <p className="text-gray-400">Số điện thoại</p>
          <div className="min-h-10 flex items-center">
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
          </div>

<<<<<<< HEAD
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
            />
          ) : (
            <p className="font-medium">{defaultForm.street_address}</p>
          )}
=======
          <p className="text-gray-400 self-start pt-2">Địa chỉ</p>
          <div className="min-h-10 flex flex-col justify-start">
            {isEditingDefault ? (
              <AddressInput
                value={defaultForm.address}
                onChange={(e) => {
                  setDefaultForm({ ...defaultForm, address: e.target.value });
                }}
                onSelectLocation={(lat, lon, address) => {
                  setDefaultForm({ 
                    ...defaultForm, 
                    address,
                    coordinates: { lat, lon }
                  });
                  setShowMap({ show: true, lat, lon, address });
                }}
              />
            ) : (
              <p className="font-medium break-words">{defaultForm.address}</p>
            )}
          </div>

          <p className="text-gray-400">Loại địa chỉ</p>
          <div className="min-h-10 flex items-center">
            {isEditingDefault ? (
              <select
                name="addressType"
                value={defaultForm.addressType || 'home'}
                onChange={handleDefaultChange}
                className="w-full bg-transparent border-b border-gray-500 text-white focus:outline-none focus:border-secondaryColor py-2"
              >
                <option value="home" className="bg-bodyBackground">Nhà riêng</option>
                <option value="office" className="bg-bodyBackground">Văn phòng</option>
                <option value="other" className="bg-bodyBackground">Khác</option>
              </select>
            ) : (
              <p className="font-medium">
                {getAddressTypeLabel(defaultForm.addressType || 'home')}
              </p>
            )}
          </div>
>>>>>>> cc490501bd56f30ede24bfecf488186d74867939
        </div>

        {isEditingDefault && showMap.show && (
          <MapDisplay 
            lat={showMap.lat} 
            lon={showMap.lon} 
            address={showMap.address || defaultForm.address} 
          />
        )}

        <div className="flex gap-6 mt-6">
          <button
            onClick={() => {
<<<<<<< HEAD
              const [street, ward, district, province] =
                defaultForm.street_address.split(',').map((s) => s.trim());

              setSelectedAddress({
                ...defaultForm,
                street_address: street,
                ward,
                district,
                province,
                is_default: true, // ⚠️ Quan trọng để giữ trạng thái mặc định
              });

              setIsUpdateModalOpen(true);
=======
              if (isEditingDefault) {
                // Gọi API lưu nếu cần
                console.log('Lưu địa chỉ mặc định:', defaultForm);
                setShowMap({ show: false, lat: 10.7769, lon: 106.7009, address: '' });
              } else {
                // Start editing
                setShowMap({ 
                  show: true, 
                  lat: defaultForm.coordinates?.lat || 10.7769, 
                  lon: defaultForm.coordinates?.lon || 106.7009, 
                  address: defaultForm.address 
                });
              }
              setIsEditingDefault(!isEditingDefault);
              // Ensure we're not editing any other address when editing the default
              if (!isEditingDefault) {
                setEditingOtherIndex(null);
              }
>>>>>>> cc490501bd56f30ede24bfecf488186d74867939
            }}
            className="px-6 py-2 md:px-10 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase text-sm md:text-base"
          >
            Cập nhật
          </button>
          {data.length === 1 && (
            <button
              onClick={() => handleDelete(defaultForm.id)}
              className="px-4 py-1 text-sm border border-red-400 text-red-400 hover:bg-red-500 hover:text-white rounded transition"
            >
              Xoá
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-gray-600 mb-10"></div>

      {/* Địa chỉ khác */}
      <div className="space-y-6">
<<<<<<< HEAD
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
=======
        <h3 className="text-lg md:text-xl font-semibold mb-4">Các địa chỉ khác</h3>

        {otherForms.length === 0 ? (
          <p className="text-gray-400">Chưa có địa chỉ khác được thêm vào.</p>
        ) : (
          otherForms.map((addr, index) => (
            <div key={index} className="mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <p className="text-gray-400">Họ và tên</p>
                <div className="min-h-10 flex items-center">
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
                </div>

                <p className="text-gray-400">Số điện thoại</p>
                <div className="min-h-10 flex items-center">
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
                </div>

                <p className="text-gray-400 self-start pt-2">Địa chỉ</p>
                <div className="min-h-10 flex flex-col justify-start">
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
                        newAddresses[index] = { 
                          ...newAddresses[index], 
                          address,
                          coordinates: { lat, lon }
                        };
                        setOtherForms(newAddresses);
                        setShowMap({ show: true, lat, lon, address });
                      }}
                    />
                  ) : (
                    <p className="font-medium break-words">{addr.address}</p>
                  )}
                </div>
                
                <p className="text-gray-400">Loại địa chỉ</p>
                <div className="min-h-10 flex items-center">
                  {editingOtherIndex === index ? (
                    <select
                      name="addressType"
                      value={addr.addressType || 'other'}
                      onChange={(e) => handleOtherChange(index, e)}
                      className="w-full bg-transparent border-b border-gray-500 text-white focus:outline-none focus:border-secondaryColor py-2"
                    >
                      <option value="home" className="bg-bodyBackground">Nhà riêng</option>
                      <option value="office" className="bg-bodyBackground">Văn phòng</option>
                      <option value="other" className="bg-bodyBackground">Khác</option>
                    </select>
                  ) : (
                    <p className="font-medium">
                      {getAddressTypeLabel(addr.addressType || 'other')}
                    </p>
                  )}
                </div>
              </div>

              {editingOtherIndex === index && showMap.show && (
                <>
                  <MapDisplay 
                    lat={showMap.lat} 
                    lon={showMap.lon} 
                    address={showMap.address || addr.address} 
                  />
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id={`default-address-${index}`}
                      checked={setAsDefaultOnSave}
                      onChange={(e) => setSetAsDefaultOnSave(e.target.checked)}
                      className="w-4 h-4 mr-2 accent-secondaryColor cursor-pointer"
                    />
                    <label htmlFor={`default-address-${index}`} className="text-sm text-gray-300 cursor-pointer">
                      Đặt làm địa chỉ mặc định
                    </label>
                  </div>
                </>
              )}

              <div className="flex flex-wrap mt-6 gap-4">
                <button
                  onClick={() => {
                    if (editingOtherIndex === index) {
                      console.log('Lưu địa chỉ khác:', otherForms[index]);
                      // Kiểm tra nếu đánh dấu để đặt làm địa chỉ mặc định
                      if (setAsDefaultOnSave) {
                        setAsDefault(index);
                      }
                      setEditingOtherIndex(null);
                      setShowMap({ show: false, lat: 10.7769, lon: 106.7009, address: '' });
                      setSetAsDefaultOnSave(false); // Reset lại trạng thái checkbox
                    } else {
                      // Make sure we're not editing the default address
                      setIsEditingDefault(false);
                      setEditingOtherIndex(index);
                      setSetAsDefaultOnSave(false); // Reset checkbox khi bắt đầu chỉnh sửa
                      setShowMap({ 
                        show: true, 
                        lat: addr.coordinates?.lat || 10.7769, 
                        lon: addr.coordinates?.lon || 106.7009, 
                        address: addr.address 
                      });
                    }
                  }}
                  className={`px-6 py-2 md:px-10 border border-secondaryColor hover:text-secondaryColor bg-secondaryColor hover:bg-bodyBackground text-headerBackground transition uppercase text-sm md:text-base ${
                    editingOtherIndex !== null && editingOtherIndex !== index ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={editingOtherIndex !== null && editingOtherIndex !== index}
                >
                  {editingOtherIndex === index ? 'Lưu' : 'Cập nhật'}
                </button>

                {editingOtherIndex === index ? (
                  <button
                    onClick={() => cancelOtherEdit(index)}
                    className="px-6 py-2 md:px-10 border border-secondaryColor hover:text-secondaryColor hover:bg-bodyBackground text-white transition uppercase text-sm md:text-base"
                  >
                    Hủy
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => deleteAddress(index)}
                      className="px-6 py-2 md:px-10 border border-red-500 hover:bg-red-500 text-white transition uppercase text-sm md:text-base"
                    >
                      Xóa
                    </button>
                    

                  </>
                )}
              </div>

              {index < otherForms.length - 1 && (
                <div className="border-t border-gray-600 my-10"></div>
              )}
>>>>>>> cc490501bd56f30ede24bfecf488186d74867939
            </div>
          ))
        )}
      </div>

      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {
          toast.success('Thêm địa chỉ thành công!');
          refetch(); // Làm mới danh sách địa chỉ
          setIsModalOpen(false);
        }}
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