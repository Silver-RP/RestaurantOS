export interface Address {
    id: string;
    user_id?: string;
    full_name: string;
    phone: string;
    province: string;
    district: string; 
    ward: string;
    street_address: string;
    address_type: 'HOME' | 'WORK' | 'OTHER'; 
    is_default: boolean;
    createdAt: string;
    updatedAt: string;
    lat: number;
    lon: number;
  }
export interface AddressInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectLocation: (lat: number, lon: number, address: string) => void;
  ward: string;
  province: string;
  district: string;
}

export interface AddressData {
  lat: string;
  lon: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    village?: string;
    hamlet?: string;
    city_district?: string;
    county?: string;
    state?: string;
    postcode?: string;
    city?: string;
    country?: string;
    country_code?: string;
  };
}