import { shouldUseApi, request } from '../lib/api';
import { HttpError } from '../lib/httpError';
import type { CreateWithdrawalRequest } from '../types/api';
import { MOCK_WITHDRAWALS } from '../mocks/data';

export const withdrawalsService = {
  createWithdrawal: async (payload: CreateWithdrawalRequest) => {
    if (!shouldUseApi()) return { ok: true };
    try {
      return await request('/withdrawals', { method: 'POST', body: JSON.stringify(payload) });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return { ok: true };
      }
      throw error;
    }
  },
  getWithdrawals: async (signal?: AbortSignal) => {
    if (!shouldUseApi()) return MOCK_WITHDRAWALS;
    try {
      return await request('/withdrawals', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return MOCK_WITHDRAWALS;
      }
      throw error;
    }
  },
};
