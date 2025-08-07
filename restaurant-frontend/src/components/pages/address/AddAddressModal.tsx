/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { AddressInput } from './AddressInput';
import { MapDisplay } from './MapDisplay';
import { FiChevronDown } from 'react-icons/fi';
import { createAddress, searchAddress } from '@/api/AddressApi';
import { toast } from 'react-toastify';
import { Listbox, ListboxButton, ListboxOptions } from '@headlessui/react';
import { useDistricts, useProvinces, useWards } from '@/hooks/useAddress';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    province: string,
    ward: string,
    street_address: string,
    full_name: string,
    lat: number,
    lon: number,
    phone: string,
    addressType: string,
  ) => void;
  total: number;
}

interface FormValues {
  full_name: string;
  province: string;
  ward: string;
  street_address: string;
  phone: string;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  total,
}) => {
  const { provinces } = useProvinces();
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('79');
  const { districts } = useDistricts(selectedProvinceCode);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('');
  const { wards } = useWards(selectedDistrictCode);
  const [locationError, setLocationError] = useState('');
  const [addressResultObjects, setAddressResultObjects] = useState<any[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [addressType, setAddressType] = useState('home');
  const [isDefault, setIsDefault] = useState(false);
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
      province: selectedProvinceCode,
      ward: '',
      street_address: '',
      phone: '',
    },
  });
  const watchedAddress = watch('street_address');
  useEffect(() => {
    if (isOpen) {
      setSelectedDistrictCode(''); 
    }
  }, [isOpen]);
  useEffect(() => {
    let active = true;
    if (watchedAddress && watchedAddress.length > 3) {
      setShowSuggestions(true);
      const fetchSuggestions = async () => {
        try {
          const results = await searchAddress(watchedAddress);
          if (active) {
            setAddressResultObjects(results);
            setAddressSuggestions(results.map((r: any) => r.display_name || r.address || r.formatted_address || r.name || ''));
          }
        } catch {
          if (active) {
            setAddressResultObjects([]);
            setAddressSuggestions([]);
          }
        }
      };
      fetchSuggestions();
    } else {
      setAddressResultObjects([]);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
    return () => {
      active = false;
    };
  }, [watchedAddress, selectedWard, selectedProvinceCode]);

  useEffect(() => {
    if (isOpen) {
      setSelectedWard('');
      setLat(0);
      setLon(0);
      setIsDuplicate(false);
      reset();
    }
  }, [isOpen]);
  const normalizeStreet = (input: string): string => {
    const normalized = input
      .replace(/\b(Phường|TP\.?|Thành phố|TP|Thủ Đức)\b/gi, '')
      .replace(/[,]+/g, ',')
      .replace(/,\s*,/g, ',')
      .replace(/\s{2,}/g, ' ')
      .replace(/^,|,$/g, '')
      .trim();
    return normalized;
  };

  useEffect(() => {
    if (isDuplicate) setIsDuplicate(false);

    const timeout = setTimeout(async () => {
      const street = normalizeStreet(watchedAddress);

      if (street.length > 5 && selectedWard) {
        const fullAddress = `${street}, ${selectedWard}, ${selectedProvinceCode}`;

        try {
          const results = await searchAddress(fullAddress);
          if (results.length > 0) {
            const { lat, lon } = results[0];
            setLat(Number(lat));
            setLon(Number(lon));
          }
        } catch (error: any) {
          if (error.response?.status === 504) {
            toast.error('Hệ thống phản hồi chậm. Vui lòng thử lại sau.');
          } else {
            toast.error('Lỗi khi tìm địa chỉ');
          }
        }
      } else {
        setLat(0);
        setLon(0);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [watchedAddress, selectedWard]);

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const onSubmit = async (data: FormValues) => {
    if (total >= 5) {
      toast.error('Bạn đã đạt giới hạn 5 địa chỉ. Không thể thêm mới.');
      return;
    }

    const isValid = await trigger([
      'full_name',
      'phone',
      'ward',
      'street_address',
    ]);

    const missingWard = !data.ward;

    if (missingWard) {
      setLocationError(
        'Vui lòng chọn Phường/Xã trước khi tiếp tục.',
      );
    } else {
      setLocationError('');
    }

    if (!isValid || missingWard) {
      return;
    }

    if (!lat || !lon) {
      toast.error('Không thể xác định vị trí. Vui lòng kiểm tra lại địa chỉ.');
      return;
    }

    // Tìm mã code cho quận và phường từ danh sách đã chọn
    const selectedDistrict = districts.find((d) => d.code === selectedDistrictCode);
    const selectedWardObj = wards.find((w) => w.name === selectedWard);
    const fullSubmitData = {
      full_name: data.full_name,
      phone: data.phone,
      province: selectedDistrict?.province_code || selectedProvinceCode,
      province_code: selectedProvinceCode,
      district: selectedDistrict?.name || '',
      district_code: selectedDistrictCode,
      ward: selectedWard,
      ward_code: selectedWardObj?.code || '',
      street_address: normalizeStreet(data.street_address),
      address_type: addressType.toUpperCase() as 'HOME' | 'WORK' | 'OTHER',
      is_default: isDefault || total === 0,
      lat,
      lon,
    };

    try {
      await createAddress(fullSubmitData);
      try {
        onClose();
        console.log('Modal đóng thành công');
      } catch (err) {
        console.error(' Lỗi khi gọi onClose():', err);
      }

      try {
        onSave(
          selectedProvinceCode,
          selectedWard,
          normalizeStreet(data.street_address),
          data.full_name,
          lat,
          lon,
          data.phone,
          addressType,
        );
        console.log('Gọi onSave thành công');
      } catch (err) {
        console.error('Lỗi khi gọi onSave():', err);
      }

      reset();
      setIsDuplicate(false);
    } catch (error: any) {
      console.error('Lỗi khi gọi createAddress:', error);
      if (error.response?.status === 409) {
        setIsDuplicate(true);
        toast.error('Địa chỉ này đã tồn tại!');
      } else {
        toast.error('Tạo địa chỉ thất bại. Vui lòng thử lại sau.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <GlobalModal>
      <div
        className="bg-bodyBackground p-4 sm:p-5 md:p-6 rounded-lg w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 border border-[#FFE0A0] max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] overflow-y-auto relative"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
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
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm md:text-base mb-1">
                Tỉnh / Thành Phố
              </label>
              <div className="border-b border-gray-500 py-1.5 text-white text-sm md:text-base">
                Hồ Chí Minh
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm md:text-base mb-1">Quận/Huyện</label>
              <Listbox
                value={selectedDistrictCode}
                onChange={(value) => {
                  setSelectedDistrictCode(value);
                  setSelectedWard('');
                  setValue('ward', '');
                }}
              >
                <div className="relative">
                  <ListboxButton className="w-full bg-transparent border-b border-gray-500 text-white py-1.5 flex items-center justify-between text-sm md:text-base">
                    <span className="truncate capitalize">
                      {districts.find((d) => d.code === selectedDistrictCode)?.name || 'Chọn quận/huyện'}
                    </span>
                    <FiChevronDown className="ml-2 text-white" />
                  </ListboxButton>

                  <ListboxOptions className="absolute w-full mt-1 bg-bodyBackground border border-white/20 rounded-md shadow-lg z-10 max-h-60 overflow-auto text-sm">
                    {districts.map((district) => (
                      <Listbox.Option
                        key={district.code}
                        value={district.code}
                        className={({ active, selected }) =>
                          `p-2 cursor-pointer rounded-md transition ${active ? 'bg-white/10' : ''
                          } ${selected ? 'border-l-4 border-secondaryColor' : ''}`
                        }
                      >
                        {district.name}
                      </Listbox.Option>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>
            </div>
            <Controller
              name="ward"
              control={control}
              rules={{ required: 'Vui lòng chọn Phường' }}
              render={({ field }) => (
                <div className="flex flex-col">
                  <label className="text-gray-400 text-sm md:text-base mb-1">
                    Phường
                  </label>
                  <Listbox
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setSelectedWard(value);
                      setLocationError('');
                    }}
                  >
                    <div className="relative">
                      <ListboxButton className="w-full bg-transparent border-b border-gray-500 text-white py-1.5 flex items-center justify-between text-[11px] md:text-base">
                        <span className="truncate capitalize">
                          {field.value || 'Chọn phường'}
                        </span>
                        <FiChevronDown className="ml-2 text-white" />
                      </ListboxButton>

                      <ListboxOptions className="absolute w-full mt-1 bg-bodyBackground border border-white/20 rounded-md shadow-lg z-10 max-h-60 overflow-auto text-sm">
                        {wards.map((ward) => (
                          <Listbox.Option
                            key={ward.code}
                            value={ward.name}
                            className={({ active, selected }) =>
                              `p-2 cursor-pointer rounded-md transition ${active ? 'bg-white/10' : ''
                              } ${selected ? 'border-l-4 border-secondaryColor' : ''}`
                            }
                          >
                            {ward.name}
                          </Listbox.Option>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>

                  {errors.ward && (
                    <span className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.ward.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            {!selectedWard ? (
              <p className="text-sm italic text-gray-400">
                Vui lòng chọn Quận/Phường trước khi nhập địa chỉ chi tiết
              </p>
            ) : (
              <Controller
                name="street_address"
                control={control}
                rules={{ required: 'Địa chỉ không được để trống' }}
                render={({ field }) => (
                  <div className="relative">
                    <AddressInput
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        trigger('street_address');
                        setShowSuggestions(true);
                      }}
                      onSelectLocation={(lat, lon, address) => {
                        setLat(lat);
                        setLon(lon);
                        setValue('street_address', address);
                        setShowSuggestions(false);
                      }}
                      ward={selectedWard}
                      province={selectedProvinceCode}
                      district={selectedDistrictCode}
                    />
                    {showSuggestions && (
                      addressSuggestions.length > 0 ? (
                        <ul className="absolute left-0 right-0 bg-bodyBackground border border-gray-700 rounded shadow-lg z-20 mt-1 max-h-48 overflow-auto text-sm">
                          {addressSuggestions.map((suggestion, idx) => (
                            <li
                              key={idx}
                              className="px-3 py-2 cursor-pointer hover:bg-secondaryColor hover:text-black transition"
                              onClick={() => {
                                const selectedObj = addressResultObjects.find(
                                  (r: any) =>
                                    r.display_name === suggestion ||
                                    r.address === suggestion ||
                                    r.formatted_address === suggestion ||
                                    r.name === suggestion
                                );
                                if (selectedObj) {
                                  setValue('street_address', suggestion);
                                  setLat(Number(selectedObj.lat) || 0);
                                  setLon(Number(selectedObj.lon) || 0);
                                } else {
                                  setValue('street_address', suggestion);
                                  setLat(0);
                                  setLon(0);
                                }
                                setShowSuggestions(false);
                              }}
                            >
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="absolute left-0 right-0 bg-bodyBackground border border-gray-700 rounded shadow-lg z-20 mt-1 p-3 text-sm text-gray-400">
                          Không có gợi ý địa chỉ phù hợp.
                        </div>
                      )
                    )}
                  </div>
                )}
              />
            )}

            {errors.street_address && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.street_address?.message}
              </span>
            )}
          </div>
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
          {lat === 0 && normalizeStreet(watchedAddress).length > 5 && (
            <p className="text-red-400 text-sm mt-2">
              Không tìm thấy vị trí phù hợp. Vui lòng kiểm tra lại tên đường.
            </p>
          )}
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
              className={`px-3 sm:px-4 md:px-6 py-1 md:py-2 border border-secondaryColor bg-secondaryColor text-headerBackground hover:bg-bodyBackground hover:text-white transition uppercase text-xs sm:text-sm md:text-base ${isDuplicate ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isDuplicate ? 'Địa chỉ đã tồn tại' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </GlobalModal>
  );
};

