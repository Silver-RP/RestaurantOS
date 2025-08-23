import axios from 'axios';

export async function registerCashierApi(data: FormData) {
  return axios.post('http://127.0.0.1:4000/api/auth_cashier/register_face', data);
}
