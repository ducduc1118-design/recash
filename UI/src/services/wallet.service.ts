import { shouldUseApi, request } from '../lib/api';
import { HttpError } from '../lib/httpError';
import type { GetLedgerResponse, GetWalletResponse } from '../types/api';
import { MOCK_LEDGER, MOCK_WALLET_SUMMARY } from '../mocks/data';

export const walletService = {
  getWallet: async (signal?: AbortSignal): Promise<GetWalletResponse> => {
    if (!shouldUseApi()) return MOCK_WALLET_SUMMARY;
    try {
      return await request<GetWalletResponse>('/wallet', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return MOCK_WALLET_SUMMARY;
      }
      throw error;
    }
  },
  getLedger: async (signal?: AbortSignal): Promise<GetLedgerResponse> => {
    if (!shouldUseApi()) return MOCK_LEDGER;
    try {
      return await request<GetLedgerResponse>('/wallet/ledger', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return MOCK_LEDGER;
      }
      throw error;
    }
  },
};
