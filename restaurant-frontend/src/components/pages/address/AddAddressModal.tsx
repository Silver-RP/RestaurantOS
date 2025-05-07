import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { AddressInput } from './AddressInput';
import { MapDisplay } from './MapDisplay';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: string, lat: number, lon: number, name: string, phone: string, addressType: string) => void;
}

interface FormValues {
  name: string;
  phone: string;
  address: string;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({ isOpen, onClose, onSave }) => {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [addressType, setAddressType] = useState('home');
  const [isDefault, setIsDefault] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
    trigger
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      phone: '',
      address: ''
    }
  });

  // Hàm validate cho số điện thoại
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // Hàm validate cho địa chỉ
  const validateAddress = (address: string): boolean => {
    return address.trim().length > 0;  
  };

  const onSubmit = (data: FormValues) => {
    if (data.name && data.phone && data.address && lat && lon) {
      onSave(data.address, lat, lon, data.name, data.phone, addressType);
      reset(); // Reset form fields
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-bodyBackground p-6 rounded-lg w-4/12 border border-[#FFE0A0] max-h-[80vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-4xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-white mb-4">Thêm Địa Chỉ</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-gray-400">Họ và Tên</label>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Tên không được để trống' }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
                  placeholder="Nhập họ và tên"
                />
              )}
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name?.message}</span>}
          </div>

          {/* Phone */}
          <div>
            <label className="text-gray-400">Số Điện Thoại</label>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: 'Số điện thoại không được để trống',
                validate: validatePhone
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
                  placeholder="Nhập số điện thoại"
                />
              )}
            />
            {errors.phone && <span className="text-red-500 text-sm">{errors.phone?.message}</span>}
          </div>

          {/* Address Input */}
          <AddressInput
            value={getValues('address')}
            onChange={(e) => {
              setValue('address', e.target.value);
              trigger('address'); // Kiểm tra lại validate mỗi khi thay đổi giá trị
            }}
            onSelectLocation={(lat: number, lon: number, address: string) => {
              setLat(lat);
              setLon(lon);
              setValue('address', address);
              trigger('address'); // Kiểm tra lại validate mỗi khi người dùng chọn địa chỉ
            }}
          />
          {errors.address && <span className="text-red-500 text-sm">Địa chỉ không được để trống</span>}

          {/* Map Display */}
          {lat !== 0 && lon !== 0 && (
            <MapDisplay lat={lat} lon={lon} address={getValues('address')} />
          )}

          {/* Address Type */}
          <div>
            <label className="text-gray-400">Loại Địa Chỉ</label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="home"
                  checked={addressType === 'home'}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="hidden"
                />
                <span
                  className={`px-6 py-2 rounded-md border border-gray-500 ${addressType === 'home' ? 'bg-secondaryColor text-black' : 'bg-bodyBackground text-white'}`}
                >
                  Nhà riêng
                </span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="office"
                  checked={addressType === 'office'}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="hidden"
                />
                <span
                  className={`px-6 py-2 rounded-md border border-gray-500 ${addressType === 'office' ? 'bg-secondaryColor text-black' : 'bg-bodyBackground text-white'}`}
                >
                  Văn phòng
                </span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="other"
                  checked={addressType === 'other'}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="hidden"
                />
                <span
                  className={`px-6 py-2 rounded-md border border-gray-500 ${addressType === 'other' ? 'bg-secondaryColor text-black' : 'bg-bodyBackground text-white'}`}
                >
                  Khác
                </span>
              </label>
            </div>
          </div>

          {/* Set as Default */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={() => setIsDefault(!isDefault)}
              id="isDefault"
              className="text-secondaryColor"
            />
            <label htmlFor="isDefault" className="text-white">Đặt làm địa chỉ mặc định</label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-secondaryColor text-secondaryColor hover:bg-bodyBackground hover:text-white transition uppercase text-sm md:text-base"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-secondaryColor text-headerBackground bg-secondaryColor hover:bg-bodyBackground hover:text-white transition uppercase text-sm md:text-base"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
