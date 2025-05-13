import Cookies from 'js-cookie';

export const setAccessToken = (token: string) => {
  Cookies.set('accessToken', token, {
    expires: 1 / 24,
    sameSite: import.meta.env.PROD ? 'None' : 'Lax',
    secure: import.meta.env.PROD,
  });
};

export const setRefreshToken = (refresh_token: string, rememberMe: boolean | undefined) => {
  const expires = rememberMe ? 21 : 2; 
  
  Cookies.set('refreshToken', refresh_token, {
    expires: expires,
    sameSite: import.meta.env.PROD ? 'None' : 'Lax',
    secure: import.meta.env.PROD,
  });
};

export const clearAuthCookies = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');

  console.log('Auth cookies cleared');
};

export const getAccessToken = () => Cookies.get('accessToken');
export const getRefreshToken = () => Cookies.get('refreshToken');
