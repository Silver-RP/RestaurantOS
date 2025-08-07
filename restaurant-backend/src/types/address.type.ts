import mongoose, { Document } from 'mongoose';

export interface IAddress {
  
  user_id: string;
  full_name: string;
  phone: string;

  province: string;
  district?: string;
  ward: string;
  street_address: string;

  postcode?: string;
  display_name?: string;
  osm_id?: string;
  osm_type?: string;
  boundingbox?: string[];

  lat?: number;
  lon?: number;

  address_type?: 'HOME' | 'WORK' | 'OTHER';
  is_default?: boolean;
}
