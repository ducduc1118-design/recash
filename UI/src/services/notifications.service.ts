import { shouldUseApi, request } from '../lib/api';
import { HttpError } from '../lib/httpError';
import type { GetNotificationsResponse } from '../types/api';
import { MOCK_NOTIFICATIONS } from '../mocks/data';

export const notificationsService = {
  getNotifications: async (signal?: AbortSignal): Promise<GetNotificationsResponse> => {
    if (!shouldUseApi()) return MOCK_NOTIFICATIONS;
    try {
      return await request<GetNotificationsResponse>('/notifications', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return MOCK_NOTIFICATIONS;
      }
      throw error;
    }
  },
};
