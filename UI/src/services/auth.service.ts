import { shouldUseApi, request } from '../lib/api';
import { HttpError } from '../lib/httpError';
import { clearAuthToken, clearStoredUser, disableDemoMode, getStoredUser, setAuthToken, setStoredUser } from '../lib/auth';
import { MOCK_USER } from '../mocks/data';
import type { LoginRequest, LoginResponse, UpdateMeRequest } from '../types/api';
import type { User } from '../types/domain';

export const authService = {
  me: async (signal?: AbortSignal): Promise<User> => {
    if (!shouldUseApi()) return MOCK_USER;
    try {
      return await request('/me', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return MOCK_USER;
      }
      throw error;
    }
  },
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await request<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
    if (response?.token) {
      setAuthToken(response.token);
      setStoredUser(response.user);
    }
    return response;
  },
  updateMe: async (payload: UpdateMeRequest): Promise<User> => {
    if (!shouldUseApi()) {
      const current = getStoredUser<User>() || MOCK_USER;
      const updated = { ...current, ...payload };
      setStoredUser(updated);
      return updated;
    }
    return request<User>('/me', { method: 'PATCH', body: JSON.stringify(payload) });
  },
  logout: async () => {
    disableDemoMode();
    clearAuthToken();
    clearStoredUser();
    if (shouldUseApi()) {
      await request('/auth/logout', { method: 'POST' });
    }
  },
};
