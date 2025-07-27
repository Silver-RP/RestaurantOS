import Cookies from 'js-cookie';

const getCookieOptions = (expires: number) => ({
  expires,
  sameSite: import.meta.env.PROD ? 'None' as const : 'Lax' as const,
  secure: import.meta.env.PROD,
  // path: '/', // Ensure cookies work across all routes
});

// Individual token setters (for development/testing)
export const setAccessToken = (token: string) => {
  Cookies.set('accessToken', token, getCookieOptions(1 / 24)); 
};

export const setRefreshToken = (refreshToken: string, rememberMe?: boolean) => {
  const expires = rememberMe ? 21 : 2; 
  Cookies.set('refreshToken', refreshToken, getCookieOptions(expires));
};

export const setUserInfo = (userInfo: any, rememberMe?: boolean) => {
  const expires = rememberMe ? 21 : 2;
  Cookies.set('userInfo', JSON.stringify(userInfo), getCookieOptions(expires));
};

// Batch setter (recommended for login flow)
export const setAuthData = (
  accessToken: string, 
  refreshToken: string, 
  userInfo: any, 
  rememberMe?: boolean
) => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken, rememberMe);
  setUserInfo(userInfo, rememberMe);
};

// Getters
export const getAccessToken = () => Cookies.get('accessToken');
export const getRefreshToken = () => Cookies.get('refreshToken');

export const getUserInfo = () => {
  const userInfo = Cookies.get('userInfo');
  try {
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.warn('Failed to parse userInfo from cookie:', error);
    return null;
  }
};

export const getAuthTokens = () => ({
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
});

// Validation
export const isAuthenticated = () => {
  const { accessToken, refreshToken } = getAuthTokens();
  return !!(accessToken || refreshToken);
};

export const hasValidAccessToken = () => !!getAccessToken();

// Clear functions
export const clearAuthCookies = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  Cookies.remove('userInfo');
};

export const clearAccessToken = () => {
  Cookies.remove('accessToken');
};

export const checkBackendCookies = () => {
  return document.cookie.includes('session') || document.cookie.includes('auth');
};

// For migration to backend-set cookies
export const migrateToBackendCookies = () => {
  clearAuthCookies();
  console.log('Migrated to backend-managed cookies');
};