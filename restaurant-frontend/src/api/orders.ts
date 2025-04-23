
import api from './axiosInstance'

export const getOrderHistory = async () => {
  const res = await api.get('/order/my-orders')
  return res.data
}
