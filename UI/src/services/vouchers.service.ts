import { shouldUseApi, request } from '../lib/api';
import { HttpError } from '../lib/httpError';
import type { GetVouchersResponse } from '../types/api';
import { MOCK_VOUCHERS } from '../mocks/data';

export const vouchersService = {
  getVouchers: async (signal?: AbortSignal, params: { search?: string; category?: string; type?: string } = {}): Promise<GetVouchersResponse> => {
    if (!shouldUseApi()) return MOCK_VOUCHERS;
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.category) query.set('category', params.category);
    if (params.type) query.set('type', params.type);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    try {
      return await request<GetVouchersResponse>(`/vouchers${suffix}`, { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return MOCK_VOUCHERS;
      }
      throw error;
    }
  },
  getVoucher: async (id: string, signal?: AbortSignal) => {
    if (!shouldUseApi()) return MOCK_VOUCHERS.find((v) => v.id === id) || MOCK_VOUCHERS[0];
    try {
      return await request(`/vouchers/${id}`, { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return MOCK_VOUCHERS.find((v) => v.id === id) || MOCK_VOUCHERS[0];
      }
      throw error;
    }
  },
};
