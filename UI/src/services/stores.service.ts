import { shouldUseApi, request } from '../lib/api';
import { HttpError } from '../lib/httpError';
import type { GetStoresResponse } from '../types/api';
import { MOCK_STORES } from '../mocks/data';

export const storesService = {
  getStores: async (signal?: AbortSignal): Promise<GetStoresResponse> => {
    if (!shouldUseApi()) return MOCK_STORES;
    try {
      return await request<GetStoresResponse>('/stores', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return MOCK_STORES;
      }
      throw error;
    }
  },
};
