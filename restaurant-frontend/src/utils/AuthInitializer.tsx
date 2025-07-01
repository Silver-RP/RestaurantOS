import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { refreshAccessToken } from '@/api/AuthApi';
import { fetchCurrentUser } from '@/redux/feature/user/userAction';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from 'types/Auth.type';

const AuthInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const init = async () => {
      try {
        const res = await refreshAccessToken();
        if (res?.accessToken) {
          const decoded = jwtDecode<DecodedToken>(res.accessToken);
          const userId = decoded.id;

          dispatch(fetchCurrentUser({ userId }));
        }
      } catch (err) {
        console.error('Không thể refresh access token:', err);
      }
    };

    init();
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
