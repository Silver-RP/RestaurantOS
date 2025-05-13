'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { AddressInput } from './AddressInput';
import { MapDisplay } from './MapDisplay';
import { Listbox } from '@headlessui/react';
import { FiChevronDown } from 'react-icons/fi';
import { createAddress, searchAddress } from '@/api/AddressApi';
import { cities, wardsByDistrict } from '@/utils/DataAddress';
import { toast } from 'react-toastify';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    province: string,
    district: string,
    ward: string,
    street_address: string,
    full_name: string,
    lat: number,
    lon: number,
    phone: string,
    addressType: string,
  ) => void;
}

interface FormValues {
  full_name: string;
  province: string;
  district: string;
  ward: string;
  street_address: string;
  phone: string;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const getFullAddress = (
    street: string,
    ward: string,
    district: string,
    province: string,
  ) => {
    return `${street}, ${ward}, ${district}, ${province}`;
  };
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [addressType, setAddressType] = useState('home');
  const [isDefault, setIsDefault] = useState(false);
  const [selectedCity, setSelectedCity] = useState('TP. Hồ Chí Minh');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      full_name: '',
      province: selectedCity,
      district: selectedDistrict,
      ward: selectedWard,
      street_address: '',
      phone: '',
    },
  });
  const watchedAddress = watch('street_address');

  const normalizeStreet = (input: string): string => {
    return input
      .replace(/\b(Phường|Quận|Huyện|TP\.?|Thành phố|TP|Thủ Đức)\b/gi, '')
      .replace(/[,]+/g, ',')
      .replace(/,\s*,/g, ',')
      .replace(/\s{2,}/g, ' ')
      .replace(/^,|,$/g, '')
      .trim();
  };
  useEffect(() => {
      if (isDuplicate) setIsDuplicate(false); // reset lại khi người dùng sửa

    const timeout = setTimeout(async () => {
      const street = normalizeStreet(watchedAddress);

      if (
        street.length > 5 // ✅ chỉ cần người dùng nhập rõ tên đường là gọi
      ) {
        const fullAddress = getFullAddress(
          street,
          selectedWard || '', // vẫn truyền ward nếu có
          selectedDistrict || '', // nhưng không bắt buộc phải chọn
          selectedCity,
        );

        try {
          const results = await searchAddress(fullAddress);
          if (results.length > 0) {
            const { lat, lon } = results[0];
            setLat(Number(lat));
            setLon(Number(lon));
          }
        } catch (error) {
          console.error('❌ Lỗi khi tìm địa chỉ:', error);
        }
      } else {
        // ❌ reset nếu nhập thiếu
        setLat(0);
        setLon(0);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [watchedAddress, selectedDistrict, selectedWard]);

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const onSubmit = async (data: FormValues) => {
    if (!selectedDistrict || !selectedWard || !lat || !lon) {
      toast.error('Vui lòng điền đủ thông tin');
      return;
    }

    const fullSubmitData = {
      full_name: data.full_name,
      phone: data.phone,
      province: selectedCity,
      district: selectedDistrict,
      ward: selectedWard,
      street_address: normalizeStreet(data.street_address),
      address_type: addressType.toUpperCase() as 'HOME' | 'WORK' | 'OTHER',
      is_default: isDefault,
      lat,
      lon,
    };

    try {
      await createAddress(fullSubmitData); 
      reset();
      setIsDuplicate(false); // reset lại nếu thêm thành công
      onSave(
        selectedCity,
        selectedDistrict,
        selectedWard,
        normalizeStreet(data.street_address),
        data.full_name,
        lat,
        lon,
        data.phone,
        addressType,
      );
      onClose();
    } catch (error: any) {
      if (error.response?.status === 409) {
        setIsDuplicate(true); // đánh dấu địa chỉ trùng
        toast.error('Địa chỉ này đã tồn tại!');
      } else {
        toast.error('Tạo địa chỉ thất bại. Vui lòng thử lại sau.');
      }
      console.error('❌ Lỗi khi tạo địa chỉ:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-slate-900 bg-opacity-50 z-50 p-4">
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
              name="full_name"
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
            {errors.full_name && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.full_name?.message}
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
          <div className="grid grid-cols-3 gap-4">
            {/* Tỉnh / Thành Phố */}
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm md:text-base mb-1">
                Tỉnh / Thành Phố
              </label>
              <div className="border-b border-gray-500 py-1.5 text-white text-sm md:text-base">
                Hồ Chí Minh
              </div>
            </div>

            {/* Quận / Huyện */}
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm md:text-base mb-1">
                Quận / Huyện
              </label>
              <Listbox value={selectedDistrict} onChange={setSelectedDistrict}>
                <div className="relative">
                  <Listbox.Button className="w-full bg-transparent border-b border-gray-500 text-white py-1.5 flex items-center justify-between text-sm md:text-base">
                    <span className="truncate">
                      {selectedDistrict || 'Chọn quận / huyện'}
                    </span>
                    <FiChevronDown className="ml-2 text-white" />
                  </Listbox.Button>

                  <Listbox.Options className="absolute w-full mt-1 bg-bodyBackground border border-white/20 rounded-md shadow-lg z-10 max-h-60 overflow-auto text-sm">
                    {cities
                      .find((c) => c.name === selectedCity)
                      ?.districts.map((d) => (
                        <Listbox.Option
                          key={d}
                          value={d}
                          className={({ active, selected }) =>
                            `p-2 cursor-pointer rounded-md transition ${
                              active ? 'bg-white/10' : ''
                            } ${selected ? 'border-l-4 border-secondaryColor' : ''}`
                          }
                        >
                          {d}
                        </Listbox.Option>
                      ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            {/* Phường / Xã */}
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm md:text-base mb-1">
                Phường / Xã
              </label>
              <Listbox value={selectedWard} onChange={setSelectedWard}>
                <div className="relative">
                  <Listbox.Button className="w-full bg-transparent border-b border-gray-500 text-white py-1.5 flex items-center justify-between text-sm md:text-base">
                    <span className="truncate">
                      {selectedWard || 'Chọn phường / xã'}
                    </span>
                    <FiChevronDown className="ml-2 text-white" />
                  </Listbox.Button>

                  <Listbox.Options className="absolute w-full mt-1 bg-bodyBackground border border-white/20 rounded-md shadow-lg z-10 max-h-60 overflow-auto text-sm">
                    {(wardsByDistrict[selectedDistrict] || []).map((ward) => (
                      <Listbox.Option
                        key={ward}
                        value={ward}
                        className={({ active, selected }) =>
                          `p-2 cursor-pointer rounded-md transition ${
                            active ? 'bg-white/10' : ''
                          } ${selected ? 'border-l-4 border-secondaryColor' : ''}`
                        }
                      >
                        {ward}
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
              name="street_address"
              control={control}
              rules={{ required: 'Địa chỉ không được để trống' }}
              render={({ field }) => (
                <AddressInput
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger('street_address');
                  }}
                  onSelectLocation={(lat, lon, address) => {
                    setLat(lat);
                    setLon(lon);
                    setValue('street_address', address); // giờ address chỉ còn "Lê Đức Thọ"
                  }}
                />
              )}
            />
            {errors.street_address && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.street_address?.message}
              </span>
            )}
          </div>

          {/* Map Display */}
          {lat !== 0 &&
            lon !== 0 &&
            normalizeStreet(watchedAddress).length > 5 && (
              <div className="mt-2 sm:mt-3 md:mt-4">
                <MapDisplay
                  lat={lat}
                  lon={lon}
                  street_address={normalizeStreet(watchedAddress)}
                />
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
              disabled={isDuplicate}
              className={`px-3 sm:px-4 md:px-6 py-1 md:py-2 border border-secondaryColor bg-secondaryColor text-headerBackground hover:bg-bodyBackground hover:text-white transition uppercase text-xs sm:text-sm md:text-base ${
                isDuplicate ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isDuplicate ? 'Địa chỉ đã tồn tại' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
