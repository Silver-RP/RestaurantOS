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
  }
export interface AddressInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

