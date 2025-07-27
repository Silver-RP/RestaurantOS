import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/feature/auth/authSlice';
import { getUserInfo } from '../../utils/tokenHelpers';
import type { RootState } from '../../redux/store';

export const AuthListener = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo && !isAuthenticated) {
      dispatch(setUser(userInfo));
    }

    const handleAuthLogout = (event: CustomEvent) => {
      const { type, reason } = event.detail || {};
      console.log(`Auth logout: ${type}`, reason ? `- ${reason}` : '');
    };

    window.addEventListener('auth:logout', handleAuthLogout as EventListener);
    
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout as EventListener);
    };
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
};
