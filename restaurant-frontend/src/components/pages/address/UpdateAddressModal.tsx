import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useForm, Controller } from 'react-hook-form';
import { FiChevronDown } from 'react-icons/fi';
import { AddressInput } from './AddressInput';
import { MapDisplay } from './MapDisplay';
import { updateAddress } from '@/api/AddressApi';
import { Listbox, ListboxButton, ListboxOptions } from '@headlessui/react';
import { useDistricts, useProvinces, useWards } from '@/hooks/useAddress';


interface UpdateAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: any;
  onSave: () => void;
}

interface FormValues {
  full_name: string;
  province: string;
  district: string;
  ward: string;
  phone: string;
  street_address: string;
  address_type: 'HOME' | 'WORK' | 'other';
  is_default: boolean;
}

export const UpdateAddressModal: React.FC<UpdateAddressModalProps> = ({
  isOpen,
  onClose,
  address,
  onSave,
}) => {
  const { provinces } = useProvinces();
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('79');
  const { districts } = useDistricts(selectedProvinceCode);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('');
  const { wards } = useWards(selectedDistrictCode);
  const [locationError, setLocationError] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      full_name: '',
      phone: '',
      street_address: '',
      province: 'TP. Hồ Chí Minh',
      district: '',
      ward: '',
      address_type: 'HOME',
      is_default: false,
    },
  });

  useEffect(() => {
    if (address) {
      console.log('Địa chỉ được truyền vào:', address);
      // Luôn ưu tiên lấy từ trường riêng, không tách chuỗi nếu đã có
      reset({
        full_name: address.name || address.full_name || '',
        phone: address.phone || '',
        street_address: address.street_address || '',
        ward: address.ward || '',
        district: address.district || '',
        province: address.province || 'TP. Hồ Chí Minh',
        address_type: address.address_type || 'HOME',
        is_default: address.is_default || false,
      });
      setDistrict(address.district || '');
      setWard(address.ward || '');
      setLat(address.lat || 0);
      setLon(address.lon || 0);

      // Tìm code quận từ tên quận và set cho Listbox
      if (address.district) {
        const foundDistrict = districts.find((d) => d.name === address.district);
        if (foundDistrict) {
          setSelectedDistrictCode(foundDistrict.code);
        } else {
          setSelectedDistrictCode('');
        }
      } else {
        setSelectedDistrictCode('');
      }
    }
  }, [address, reset]);

  const watchedStreet = watch('street_address');
  const [debouncedStreet] = useDebounce(watchedStreet, 600);

  useEffect(() => {
    setAddressError(null);
    if (debouncedStreet && debouncedStreet.length > 5 && ward && district) {
      const full = `${debouncedStreet}, ${ward}, ${district}, TP. Hồ Chí Minh`;
      (async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(full)}&format=json`,
          );
          const json = await res.json();
          if (json.length > 0) {
            setLat(parseFloat(json[0].lat));
            setLon(parseFloat(json[0].lon));
          } else {
            setLat(0);
            setLon(0);
            setAddressError('Không tìm thấy đường này trên bản đồ');
          }
        } catch (e) {
          console.error('Lỗi tìm kiếm toạ độ:', e);
          setAddressError('Lỗi khi tìm địa chỉ. Vui lòng thử lại.');
        }
      })();
    }
  }, [debouncedStreet, ward, district]);

  const onSubmit = async (data: FormValues) => {
    if (!district || !ward) {
      alert('Vui lòng nhập đầy đủ quận và phường');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await updateAddress(address.id, {
        ...data,
        district,
        ward,
        province: 'TP. Hồ Chí Minh',
        lat: lat || undefined,
        lon: lon || undefined, // Gửi lên, BE sẽ tự xử nếu thiếu
      });

      if (response?.data) {
        console.log(' Địa chỉ sau khi chuẩn hóa:', response.data);
      }

      onSave();
    } catch (err) {
      console.error('Lỗi cập nhật địa chỉ:', err);
      alert('Cập nhật địa chỉ thất bại');
    } finally {
      setIsSubmitting(false);
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
          Cập nhật địa chỉ
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-gray-400">Họ tên</label>
              <Controller
                name="full_name"
                control={control}
                rules={{ required: 'Vui lòng điền Họ tên' }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full bg-transparent border-b border-gray-500 text-white py-2 focus:outline-none"
                  />
                )}
              />
              {errors.full_name && (
                <p className="text-red-500 text-sm">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-400">Số điện thoại</label>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: 'Vui lòng nhập số điện thoại',
                  pattern: {
                    value: /^[0-9]{9,11}$/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full bg-transparent border-b border-gray-500 text-white py-2 focus:outline-none"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-400">Tỉnh / Thành phố</label>
              <div className="w-full border-b border-gray-500 py-2 text-white">
                TP. Hồ Chí Minh
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 text-sm md:text-base mb-1">Quận</label>
              <Listbox
                value={selectedDistrictCode}
                onChange={(value) => {
                  setSelectedDistrictCode(value);
                  setDistrict(districts.find((d) => d.code === value)?.name || '');
                  setWard('');
                  setValue('ward', '');
                }}
              >
                <div className="relative">
                  <ListboxButton className="w-full bg-transparent border-b border-gray-500 text-white py-1.5 flex items-center justify-between text-sm md:text-base">
                    <span className="truncate capitalize">
                      {districts.find((d) => d.code === selectedDistrictCode)?.name || 'Chọn quận'}
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

            <div className="flex flex-col">
              <label className="text-gray-400 text-sm md:text-base mb-1">Phường / Xã</label>
              <Listbox
                value={ward}
                onChange={(value) => {
                  setWard(value);
                  setValue('ward', value);
                }}
              >
                <div className="relative">
                  <ListboxButton className="w-full bg-transparent border-b border-gray-500 text-white py-1.5 flex items-center justify-between text-sm md:text-base">
                    <span className="truncate capitalize">
                      {wards.find((w) => w.code === ward)?.name || 'Chọn phường'}
                    </span>
                    <FiChevronDown className="ml-2 text-white" />
                  </ListboxButton>
                  <ListboxOptions className="absolute w-full mt-1 bg-bodyBackground border border-white/20 rounded-md shadow-lg z-10 max-h-60 overflow-auto text-sm">
                    {wards.map((wardItem) => (
                      <Listbox.Option
                        key={wardItem.code}
                        value={wardItem.code}
                        className={({ active, selected }) =>
                          `p-2 cursor-pointer rounded-md transition ${active ? 'bg-white/10' : ''} ${selected ? 'border-l-4 border-secondaryColor' : ''}`
                        }
                      >
                        {wardItem.name}
                      </Listbox.Option>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>
            </div>
          </div>

          <div>
            <label className="text-gray-400">Tên đường</label>
            <Controller
              name="street_address"
              control={control}
              rules={{ required: 'Vui lòng nhập tên đường' }}
              render={({ field }) => (
                <AddressInput
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e)}
                  onSelectLocation={(lat, lon, street) => {
                    setLat(lat);
                    setLon(lon);
                    setValue('street_address', street);
                  }}
                  ward={ward}
                  province="TP. Hồ Chí Minh"
                  district={district}
                />
              )}
            />
            {errors.street_address && (
              <p className="text-red-500 text-sm">
                {errors.street_address.message}
              </p>
            )}
            {addressError && (
              <p className="text-red-500 text-sm mt-1">{addressError}</p>
            )}
          </div>

          {lat !== 0 && lon !== 0 && (
            <div className="mt-3">
              <MapDisplay lat={lat} lon={lon} street_address={watchedStreet} />
            </div>
          )}

          <div className="mt-4">
            <label className="text-gray-400">Loại địa chỉ</label>
            <Controller
              name="address_type"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2 mt-2">
                  {['HOME', 'WORK', 'other'].map((type) => (
                    <button
                      type="button"
                      key={type}
                      className={`px-4 py-2 rounded border transition ${field.value === type
                        ? 'bg-secondaryColor text-black'
                        : 'border-gray-500 text-white'
                        }`}
                      onClick={() => field.onChange(type)}
                    >
                      {type === 'HOME'
                        ? 'Nhà riêng'
                        : type === 'WORK'
                          ? 'Văn phòng'
                          : 'Khác'}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <Controller
              name="is_default"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="form-checkbox"
                />
              )}
            />
            <label className="text-white">Đặt làm địa chỉ mặc định</label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-secondaryColor text-secondaryColor rounded-md"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-secondaryColor text-black rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
