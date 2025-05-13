import React, { useState, useEffect } from 'react';

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
    city_district?: string;
    city?: string;
    town?: string;
    county?: string;
    district?: string;
    quarter?: string;
    neighbourhood?: string;
  };
}

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
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}, Hồ Chí Minh&format=json&addressdetails=1&countrycodes=vn&limit=10`;
        
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'FPTPolyStudent/1.0 (lamgiabao@example.com)',
            },
          });
          const data: AddressData[] = await response.json();
          const filtered = data.filter(item =>
            item.address.city?.toLowerCase().includes('hồ chí minh') ||
            item.address.city?.toLowerCase().includes('ho chi minh')
          );
          setSuggestions(filtered);
        } catch (err) {
          console.error('Fetch error:', err);
        }
      };
      
      fetchSuggestions();
    }, 300); // Increased debounce to 300ms for better UX

    return () => clearTimeout(timeout);
  }, [query]);

  // Helper function to extract the district
  const getDistrict = (address: AddressData['address']): string => {
    // Try to get district from various possible fields
    const district = address.city_district || 
                    address.district || 
                    address.county ||
                    '';
    
    if (!district || district.toLowerCase().includes('không xác định')) {
      return '';
    }
    
    return district;
  };

  // Helper function to extract the ward (phường)
  const getWard = (address: AddressData['address']): string => {
    // Try to get ward from various possible fields
    const ward = address.suburb || 
                address.quarter || 
                address.neighbourhood ||
                '';
    
    if (!ward || ward.toLowerCase().includes('không xác định')) {
      return '';
    }
    
    return ward;
  };

  // Format the address to display properly
  const formatAddress = (item: AddressData): string => {
    // Get the base address (before HCM city)
    const baseAddress = item.display_name.split(', Thành phố Hồ Chí Minh')[0];
    
    // Get district and ward
    const district = getDistrict(item.address);
    const ward = getWard(item.address);
    
    // Build the address components
    let formattedAddress = baseAddress;
    
    // Avoid adding "Phường Không xác định" or "Quận Không xác định"
    if (ward) {
      formattedAddress += `, Phường ${ward}`;
    }
    
    if (district) {
      formattedAddress += `, Quận ${district}`;
    }
    
    formattedAddress += `, Thành phố Hồ Chí Minh`;
    
    return formattedAddress;
  };

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
              className="p-2 hover:bg-headerBackground cursor-pointer text-white"
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