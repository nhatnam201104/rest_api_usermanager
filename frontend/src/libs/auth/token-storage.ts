const ACCESS_TOKEN_KEY = 'access_token';
const LEGACY_REFRESH_TOKEN_KEY = 'refresh_token';

export const getAccessToken = () => sessionStorage.getItem(ACCESS_TOKEN_KEY);

export const hasAccessToken = () => Boolean(getAccessToken());

export const setAccessToken = (accessToken: string) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
};

export const clearTokens = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
};
