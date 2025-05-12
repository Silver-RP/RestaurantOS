import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart, getCart, deleteCartItem } from '../api/CartApi';
import { useEffect, useState } from 'react'; 
import Cookies from 'js-cookie'; 
import { toast } from 'react-toastify'; 
import { useQuery } from '@tanstack/react-query';



export const useAddToCart = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ['cart'] });
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

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (dishId: string) => deleteCartItem(dishId),
    onSuccess: () => {
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: unknown) => {
      console.error('Error deleting cart item:', error);
      toast.error('Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng!');
    }
  });
  
  return mutation;
};

