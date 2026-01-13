import { shouldUseApi, request } from '../lib/api';
import { HttpError } from '../lib/httpError';
import type { CreateSupportTicketRequest, GetSupportTicketsResponse } from '../types/api';
import { MOCK_TICKETS } from '../mocks/data';

export const supportService = {
  getTickets: async (signal?: AbortSignal): Promise<GetSupportTicketsResponse> => {
    if (!shouldUseApi()) return MOCK_TICKETS;
    try {
      return await request<GetSupportTicketsResponse>('/support/tickets', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return MOCK_TICKETS;
      }
      throw error;
    }
  },
  createTicket: async (payload: CreateSupportTicketRequest) => {
    if (!shouldUseApi()) return { ok: true };
    try {
      return await request('/support/tickets', { method: 'POST', body: JSON.stringify(payload) });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return { ok: true };
      }
      throw error;
    }
  },
};
