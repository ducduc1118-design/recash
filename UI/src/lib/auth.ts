const TOKEN_KEY = 'recash_token';
const DEMO_KEY = 'recash_demo';
const USER_KEY = 'recash_user';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setStoredUser = (user: unknown) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredUser = <T>() => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
};

export const clearStoredUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const enableDemoMode = () => {
  localStorage.setItem(DEMO_KEY, 'true');
};

export const disableDemoMode = () => {
  localStorage.removeItem(DEMO_KEY);
};

export const isDemoMode = () => localStorage.getItem(DEMO_KEY) === 'true';
