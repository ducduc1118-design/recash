import { shouldUseApi, request } from '../lib/api';
import { HttpError } from '../lib/httpError';
import type { GetReferralResponse } from '../types/api';
import { MOCK_REFERRALS } from '../mocks/data';

export const referralService = {
  getReferrals: async (signal?: AbortSignal): Promise<GetReferralResponse> => {
    if (!shouldUseApi()) return MOCK_REFERRALS;
    try {
      return await request<GetReferralResponse>('/referral', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return MOCK_REFERRALS;
      }
      throw error;
    }
  },
};
