export interface ReservationOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  note?: string;
}

export interface ReservationFormData {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  people: number;
  note: string;
  seating: string;
  menu: string;
  selectedItems: ReservationOrderItem[];
}