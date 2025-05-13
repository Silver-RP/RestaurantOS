import React, { useState, useEffect } from 'react';
import { searchAddress } from '@/api/AddressApi';

interface AddressInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectLocation: (lat: number, lon: number, address: string) => void;
}

interface AddressData {
  lat: string;
  lon: string;
  display_name: string;
  address: {
    suburb?: string;
    village?: string;
    city_district?: string;
    county?: string;
    state_district?: string;
    region?: string;
    city?: string;
    road?: string;
  };
}

// 🧠 Hàm format địa chỉ để tránh undefined
const formatAddress = (item: AddressData): string => {
  const full = item.display_name;
  const cut = full.split(', Việt Nam')[0];
  return cut.replace(/, Thành phố Hồ Chí Minh$/, '');
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
          console.error('❌ Fetch address error:', err);
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
                onSelectLocation(parseFloat(item.lat), parseFloat(item.lon), item.address.road || '');
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
