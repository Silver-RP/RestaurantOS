import React, { useState, useEffect } from 'react';
import { searchAddress } from '@/api/AddressApi';
import { AddressInputProps } from '@/types/Address.type';
import { AddressData } from '@/types/Address.type';


const formatAddress = (item: AddressData): string => {
  const address = item.address || {};
  const ward = address.suburb || address.village || '';
  const district =
    address.city_district ||
    address.county ||
    address.state ||
    address.city ||
    address.country ||
    address.country_code ||
    '';
  const base = typeof item.display_name === 'string' ? item.display_name.split(', Thành phố Hồ Chí Minh')[0] : '';

  return `${base}${ward ? `, Phường ${ward}` : ''}, TP. Hồ Chí Minh`;
};

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  onSelectLocation,
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressData[]>([]);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!query) {
        setSuggestions([]);
        return;
      }

      const fetchSuggestions = async () => {
        try {
          const data: AddressData[] = await searchAddress(`${query}, Hồ Chí Minh`);
          setSuggestions(data);
        } catch (err) {
          console.error('Fetch address error:', err);
        }
      };

      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Nhập địa chỉ, ví dụ: 123 Tô Ký"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e);
        }}
        className="w-full bg-transparent border-b border-white text-white placeholder-gray-500 focus:outline-none focus:border-secondaryColor py-2"
      />
      <ul className="rounded mt-2 bg-transparent max-h-60 overflow-y-auto">
        {suggestions.map((item, index) => {
          const addressText = formatAddress(item);
          return (
            <li
              key={index}
              className="p-2 hover:bg-headerBackground cursor-pointer"
              onClick={() => {
                onSelectLocation(parseFloat(item.lat), parseFloat(item.lon), addressText);
                setSuggestions([]);
                setQuery(addressText);
              }}
            >
              {addressText}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
