import { useMutation } from '@tanstack/react-query';
import { addToCart, getCart } from '../api/CartApi';
import { useEffect, useState } from 'react'; 
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

  useEffect(() => {
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
    onError: (error: unknown) => {
      console.error('Error adding to cart: ', error);
    },
    onSuccess: () => {

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

  return { data, isLoading, error };
}
