import { shouldUseApi, request } from '../lib/api';
import { HttpError } from '../lib/httpError';
import type { CheckinStatusResponse } from '../types/api';

export const checkinService = {
  getStatus: async (signal?: AbortSignal): Promise<CheckinStatusResponse> => {
    if (!shouldUseApi()) return { streak: 5, checkedIn: false };
    try {
      return await request<CheckinStatusResponse>('/checkin/status', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return { streak: 5, checkedIn: false };
      }
      throw error;
    }
  },
};
