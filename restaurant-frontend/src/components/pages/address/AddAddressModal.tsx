'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { AddressInput } from './AddressInput';
import { MapDisplay } from './MapDisplay';
import { Listbox } from '@headlessui/react';
import { FiChevronDown } from 'react-icons/fi';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    address: string,
    lat: number,
    lon: number,
    name: string,
    phone: string,
    addressType: string,
  ) => void;
}

interface FormValues {
  name: string;
  phone: string;
  address: string;
}

const cities = [
  {
    name: 'TP. Hồ Chí Minh',
    districts: [
      'Quận 1',
      'Quận 3',
      'Quận 5',
      'Quận 7',
      'Quận 10',
      'Quận Bình Thạnh',
      'Quận Phú Nhuận',
      'Quận Tân Bình',
      'Quận Gò Vấp',
      'Quận Thủ Đức',
      'Huyện Bình Chánh',
      'Huyện Hóc Môn',
    ],
  },
];

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [addressType, setAddressType] = useState('home');
  const [isDefault, setIsDefault] = useState(false);
  const [selectedCity, setSelectedCity] = useState('TP. Hồ Chí Minh');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
    },
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
      onSave(
        `${data.address}, ${selectedDistrict}, ${selectedCity}`,
        lat,
        lon,
        data.name,
        data.phone,
        addressType,
      );
      reset(); // Reset form fields
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50 p-4">
      <div
        className="bg-bodyBackground p-4 sm:p-5 md:p-6 rounded-lg w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 border border-[#FFE0A0] max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] overflow-y-auto relative"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl sm:text-3xl md:text-4xl"
          aria-label="Đóng"
        >
          &times;
        </button>

        <h2 className="text-xl sm:text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4">
          Thêm Địa Chỉ
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-6"
        >
          {/* Name */}
          <div>
            <label className="text-gray-400 text-sm md:text-base">
              Họ và Tên
            </label>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Tên không được để trống' }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-1 md:py-2 text-sm md:text-base"
                  placeholder="Nhập họ và tên"
                />
              )}
            />
            {errors.name && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.name?.message}
              </span>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-gray-400 text-sm md:text-base">
              Số Điện Thoại
            </label>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: 'Số điện thoại không được để trống',
                validate: (value) =>
                  validatePhone(value) || 'Số điện thoại không hợp lệ',
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-1 md:py-2 text-sm md:text-base"
                  placeholder="Nhập số điện thoại"
                />
              )}
            />
            {errors.phone && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.phone?.message}
              </span>
            )}
          </div>
          <div className="flex gap-4">
            {/* City Selection */}
            <div className="flex-1">
              <label className="text-gray-400 text-sm md:text-base">
                Tỉnh / Thành Phố
              </label>
              <input
                value="Hồ Chí Minh"
                readOnly
                className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-1 md:py-2 text-sm md:text-base"
              />
            </div>

            {/* District Selection */}
            <div className="flex-1">
              <label className="text-gray-400 text-sm md:text-base">
                Quận / Huyện
              </label>

              <Listbox value={selectedDistrict} onChange={setSelectedDistrict}>
                <div className="relative">
                  <Listbox.Button className="w-full bg-transparent border-b border-gray-500 text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-1 md:py-2 text-sm md:text-base text-left capitalize-none flex items-center justify-between">
                    <span className="truncate">
                      {selectedDistrict || 'Chọn quận / huyện'}
                    </span>
                    {/* Biểu tượng mũi tên hướng xuống từ react-icons */}
                    <FiChevronDown className="ml-2 text-white" />
                  </Listbox.Button>

                  <Listbox.Options className="absolute w-full mt-1 bg-bodyBackground border border-white/20 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                    {cities
                      .find((city) => city.name === selectedCity)
                      ?.districts.map((district) => (
                        <Listbox.Option
                          key={district}
                          value={district}
                          className={({ active, selected }) =>
                            `p-2 cursor-pointer rounded-md transition ${
                              active ? 'bg-white/10' : ''
                            } ${selected ? 'border-l-4 border-secondaryColor' : ''}`
                          }
                        >
                          <span className="text-left capitalize-none">
                            {district}
                          </span>
                        </Listbox.Option>
                      ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </div>

          {/* Address Input */}
          <div>
            <Controller
              name="address"
              control={control}
              rules={{ required: 'Địa chỉ không được để trống' }}
              render={({ field }) => (
                <AddressInput
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger('address');
                  }}
                  onSelectLocation={(
                    lat: number,
                    lon: number,
                    address: string,
                  ) => {
                    setLat(lat);
                    setLon(lon);
                    setValue('address', address);
                    trigger('address');
                  }}
                />
              )}
            />
            {errors.address && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.address?.message}
              </span>
            )}
          </div>

          {/* Map Display */}
          {lat !== 0 && lon !== 0 && (
            <div className="mt-2 sm:mt-3 md:mt-4">
              <MapDisplay lat={lat} lon={lon} address={getValues('address')} />
            </div>
          )}

          {/* Address Type */}
          <div>
            <label className="text-gray-400 text-sm md:text-base mb-2 block">
              Loại Địa Chỉ
            </label>
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
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
                  className={`px-3 sm:px-4 md:px-6 py-1 md:py-2 rounded-md border border-gray-500 text-xs sm:text-sm md:text-base ${addressType === 'home' ? 'bg-secondaryColor text-black' : 'bg-bodyBackground text-white'}`}
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
                  className={`px-3 sm:px-4 md:px-6 py-1 md:py-2 rounded-md border border-gray-500 text-xs sm:text-sm md:text-base ${addressType === 'office' ? 'bg-secondaryColor text-black' : 'bg-bodyBackground text-white'}`}
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
                  className={`px-3 sm:px-4 md:px-6 py-1 md:py-2 rounded-md border border-gray-500 text-xs sm:text-sm md:text-base ${addressType === 'other' ? 'bg-secondaryColor text-black' : 'bg-bodyBackground text-white'}`}
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
            <label
              htmlFor="isDefault"
              className="text-white text-xs sm:text-sm md:text-base"
            >
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <div className="flex justify-end gap-3 md:gap-4 mt-4 md:mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 md:px-6 py-1 md:py-2 border border-secondaryColor text-secondaryColor hover:bg-bodyBackground hover:text-white transition uppercase text-xs sm:text-sm md:text-base"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-3 sm:px-4 md:px-6 py-1 md:py-2 border border-secondaryColor text-headerBackground bg-secondaryColor hover:bg-bodyBackground hover:text-white transition uppercase text-xs sm:text-sm md:text-base"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
