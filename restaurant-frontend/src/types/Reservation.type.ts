export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'DONE';

export interface IReservation {
  _id?: string;
  full_name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  table_type: string;
  number_of_people: number;
  note?: string;
  is_choose_later: boolean;
  status: ReservationStatus;
  deposit?: number;
  deposit_amount?: number;
  payment_status: string;
  payment_method: string;
  paid_at?: string;
  order_items: IReservationDetail[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IReservationDetail {
  _id?: string;
  reservation_id: string;
  dish_id: string;
  dish_name: string;
  category: string;
  unit_price: number;
  quantity: number;
  total_amount: number;
  image?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReservationOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  note?: string;
}

export type ReservationFormData = {
  full_name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  number_of_people: number;
  note: string;
  table_type: string;
  seatingName: string;
  tableCategory?: string; // Loại bàn thực tế: 'vip', 'group', 'standard', 'quiet'
  menu: string;
  selectedItems: ReservationOrderItem[];
};
