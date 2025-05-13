import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart, getCart, deleteCartItem, updateCartItem } from '../api/CartApi';
import { useEffect, useState } from 'react'; 
import Cookies from 'js-cookie'; 
import { toast } from 'react-toastify'; 
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';



export const useAddToCart = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
        navigate('/login');
        const error = new Error('AUTH_ERROR');
        return Promise.reject(error);
      }
      return addToCart(data.dishId, data.quantity); 
    },

    onSuccess: () => {
      toast.success('Đã thêm vào giỏ hàng thành công!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: unknown) => {

      if (error instanceof Error && error.message === 'AUTH_ERROR') {
        return;
      }
      
      if (error instanceof Error && error.message.includes('Adding more exceeds available stock')) {
        toast.error('Số lượng sản phẩm vượt quá số lượng có sẵn trong kho!');
      } else if (error instanceof Error && (error.message.includes('Dish is out of stock') || error.message.includes('Dish is not available'))) {
        toast.error('Sản phẩm đã hết hàng!');
      } else {
        toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!');
      }
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

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { dishId: string; quantity: number }) => {
      // Prevent updating if quantity is less than 1
      if (data.quantity < 1) {
        toast.warning('Số lượng sản phẩm không thể nhỏ hơn 1!');
        return Promise.reject(new Error('QUANTITY_ERROR'));
      }
      return updateCartItem(data.dishId, data.quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: unknown) => {   
      if (error instanceof Error && error.message === 'QUANTITY_ERROR') {
        return;
      }

      if (error instanceof Error && error.message.includes('Adding more exceeds available stock')) {
        toast.error('Số lượng sản phẩm vượt quá số lượng có sẵn trong kho!');
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật số lượng sản phẩm trong giỏ hàng!');
      }
    }
  });

  return mutation;
};




