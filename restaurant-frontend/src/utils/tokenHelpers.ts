import Cookies from 'js-cookie';

export const setAccessToken = (token: string, rememberMe = false) => {
  Cookies.set('accessToken', token, {
    expires: rememberMe ? 7 : 1 / (24 * 60), 
    sameSite: import.meta.env.PROD ? 'None' : 'Lax',
    secure: import.meta.env.PROD,
  });
};
export const setRefreshToken = (token: string, rememberMe = false) => {
  Cookies.set('refreshToken', token, {
    expires: rememberMe ? 7 : 1 / 24,
    sameSite: import.meta.env.PROD ? 'None' : 'Lax',
    secure: import.meta.env.PROD,
  });
};
export const clearAuthCookies = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};

export const getAccessToken = () => Cookies.get('accessToken');
export const getRefreshToken = () => Cookies.get('refreshToken');
