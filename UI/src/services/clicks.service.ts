import { shouldUseApi, request } from '../lib/api';
import { HttpError } from '../lib/httpError';
import type { CreateLinkRequest, CreateLinkResponse } from '../types/api';
import { MOCK_STORES } from '../mocks/data';

const fallbackCreateLink = (url: string): CreateLinkResponse | null => {
  const lowerUrl = url.toLowerCase();
  const matchedStore = MOCK_STORES.find((store) => lowerUrl.includes(store.name.toLowerCase()));
  return matchedStore ? { store: matchedStore, cashback: matchedStore.cashbackUpTo } : null;
};

export const clicksService = {
  createLink: async (payload: CreateLinkRequest): Promise<CreateLinkResponse> => {
    if (!shouldUseApi()) {
      const fallback = fallbackCreateLink(payload.url);
      if (!fallback) {
        throw new Error('Unsupported link');
      }
      return fallback;
    }
    try {
      return await request<CreateLinkResponse>('/clicks/create-link', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        const fallback = fallbackCreateLink(payload.url);
        if (!fallback) {
          throw new Error('Unsupported link');
        }
        return fallback;
      }
      throw error;
    }
  },
};
