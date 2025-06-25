import Cookies from 'js-cookie';

const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
const cookieDomain = isProd ? '96.9.81.187' : 'localhost';

export const setCookie = (name: string, value: string, days: number = 7) => {
  Cookies.set(name, value, { expires: days, secure: isProd, sameSite: 'strict', domain: cookieDomain });
};

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

export const removeCookie = (name: string) => {
  Cookies.remove(name, { domain: cookieDomain });
};