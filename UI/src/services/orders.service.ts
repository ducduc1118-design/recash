import { shouldUseApi, request } from '../lib/api';
import { HttpError } from '../lib/httpError';
import type { GetOrderResponse, GetOrdersParams, GetOrdersResponse } from '../types/api';
import { MOCK_ORDERS } from '../mocks/data';

export const ordersService = {
  getOrders: async (params: GetOrdersParams = {}, signal?: AbortSignal): Promise<GetOrdersResponse> => {
    if (!shouldUseApi()) {
      return params.status ? MOCK_ORDERS.filter((order) => order.status === params.status) : MOCK_ORDERS;
    }
    const query = params.status ? `?status=${encodeURIComponent(params.status)}` : '';
    try {
      return await request<GetOrdersResponse>(`/orders${query}`, { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return params.status ? MOCK_ORDERS.filter((order) => order.status === params.status) : MOCK_ORDERS;
      }
      throw error;
    }
  },
  getOrder: async (id: string, signal?: AbortSignal): Promise<GetOrderResponse> => {
    if (!shouldUseApi()) {
      return MOCK_ORDERS.find((order) => order.id === id) || MOCK_ORDERS[0];
    }
    try {
      return await request<GetOrderResponse>(`/orders/${id}`, { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return MOCK_ORDERS.find((order) => order.id === id) || MOCK_ORDERS[0];
      }
      throw error;
    }
  },
};
