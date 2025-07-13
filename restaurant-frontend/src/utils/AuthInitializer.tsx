import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { refreshAccessToken } from '@/api/AuthApi';
import { fetchCurrentUser } from '@/redux/feature/user/userAction';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from 'types/Auth.type';
import Cookies from 'js-cookie';
import { loadUserFromStorage } from '@/redux/feature/auth/authSlice';

const AuthInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const init = async () => {
      try {
        // Trước tiên, thử load user từ storage
        dispatch(loadUserFromStorage());

        // Kiểm tra xem có access token không
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        if (!accessToken && refreshToken) {
          // Nếu không có access token nhưng có refresh token, thử refresh
          const res = await refreshAccessToken();
          if (res?.accessToken) {
            const decoded = jwtDecode<DecodedToken>(res.accessToken);
            const userId = decoded.id;
            dispatch(fetchCurrentUser({ userId }));
          }
        } else if (accessToken) {
          // Nếu có access token, thử decode và fetch user
          try {
            const decoded = jwtDecode<DecodedToken>(accessToken);
            const userId = decoded.id;
            dispatch(fetchCurrentUser({ userId }));
          } catch {
            // Nếu token invalid, thử refresh
            if (refreshToken) {
              const res = await refreshAccessToken();
              if (res?.accessToken) {
                const decoded = jwtDecode<DecodedToken>(res.accessToken);
                const userId = decoded.id;
                dispatch(fetchCurrentUser({ userId }));
              }
            }
          }
        }
      } catch (err) {
        console.error('Không thể khôi phục authentication state:', err);
        // Clear invalid tokens
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('userInfo');
      }
    };

    init();
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
