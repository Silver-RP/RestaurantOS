export interface IAddress {
  user_id: typeof import('mongoose').Types.ObjectId;
  full_name: string;
  phone: string;

  province: string;
  district?: string;
  ward: string;
  street_address: string;

  postcode?: string;
  display_name?: string;

  address_type?: 'HOME' | 'WORK' | 'OTHER';
  is_default?: boolean;
}
