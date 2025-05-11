import { useMutation } from '@tanstack/react-query';
import { addToCart, getCart } from '../api/CartApi';
import { useState } from 'react';
import Cookies from 'js-cookie'; 
import { toast } from 'react-toastify'; 
import { useQuery } from '@tanstack/react-query';



export const useAddToCart = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const checkLoginStatus = () => {
    const userInfo = Cookies.get('userInfo'); 
    if (userInfo) {
      setIsLoggedIn(true);
    }
  };

  useState(() => {
    checkLoginStatus();
  }, []);

  const mutation = useMutation({
    mutationFn: (data: { dishId: string; quantity: number }) => {
      if (!isLoggedIn) {
        toast.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ!');
        return Promise.reject('User not logged in');
      }

      return addToCart(data.dishId, data.quantity); 
    },
    onError: (error: any) => {
      console.error('Error adding to cart: ', error);
    },
    onSuccess: (data) => {
      toast.success('Đã thêm vào giỏ hàng thành công!');
    },
  });

  return mutation;
};

export const useGetCart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: () => getCart(),
  });
  console.log('Cart data:', data);
  console.log('Cart data123:', data?.data);
  console.log('Cart data123:', data?.items?.name);

  return { data, isLoading, error };
}
