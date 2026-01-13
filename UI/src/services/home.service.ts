import { request, shouldUseApi } from '../lib/api';
import { HttpError } from '../lib/httpError';
import type { GetHomeResponse } from '../types/api';
import { MOCK_BANNERS } from '../mocks/data';

const fallbackHome: GetHomeResponse = {
  banners: MOCK_BANNERS,
  sections: [],
};

export const homeService = {
  getHome: async (signal?: AbortSignal): Promise<GetHomeResponse> => {
    if (!shouldUseApi()) return fallbackHome;
    try {
      return await request<GetHomeResponse>('/home', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return fallbackHome;
      }
      throw error;
    }
  },
};
