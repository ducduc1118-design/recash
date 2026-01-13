import { shouldUseApi, request } from '../lib/api';
import { HttpError } from '../lib/httpError';
import type { Banner, HomeSection, Order, WithdrawalRequest } from '../types/domain';
import { MOCK_ADMIN_ORDERS, MOCK_ADMIN_USERS, MOCK_WITHDRAWALS } from '../mocks/data';

export const adminService = {
  getDashboard: async (signal?: AbortSignal) => {
    if (!shouldUseApi()) {
      return {
        totalUsers: 12405,
        totalRevenue: '$45,200',
        pendingCashout: '$3,240',
        activeOffers: 845,
      };
    }
    try {
      return await request('/admin/dashboard', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return {
          totalUsers: 12405,
          totalRevenue: '$45,200',
          pendingCashout: '$3,240',
          activeOffers: 845,
        };
      }
      throw error;
    }
  },
  getUsers: async (signal?: AbortSignal) => {
    if (!shouldUseApi()) return MOCK_ADMIN_USERS;
    try {
      return await request('/admin/users', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return MOCK_ADMIN_USERS;
      }
      throw error;
    }
  },
  getOrders: async (signal?: AbortSignal): Promise<Order[]> => {
    if (!shouldUseApi()) return MOCK_ADMIN_ORDERS;
    try {
      return await request('/admin/orders', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return MOCK_ADMIN_ORDERS;
      }
      throw error;
    }
  },
  updateOrderStatus: async (id: string, status: string, note?: string) => {
    return request(`/admin/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
  },
  getWithdrawals: async (signal?: AbortSignal): Promise<WithdrawalRequest[]> => {
    if (!shouldUseApi()) return MOCK_WITHDRAWALS;
    try {
      return await request('/admin/withdrawals', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return MOCK_WITHDRAWALS;
      }
      throw error;
    }
  },
  updateWithdrawalStatus: async (id: string, status: string) => {
    return request(`/admin/withdrawals/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  },
  getStores: async (signal?: AbortSignal) => {
    return request('/admin/stores', { signal });
  },
  getOffers: async (signal?: AbortSignal) => {
    return request('/admin/offers', { signal });
  },
  getSettings: async (signal?: AbortSignal) => {
    return request('/admin/settings', { signal });
  },
  updateSettings: async (payload: Record<string, unknown>) => {
    return request('/admin/settings', { method: 'PATCH', body: JSON.stringify(payload) });
  },
  getBanners: async (signal?: AbortSignal): Promise<Banner[]> => {
    if (!shouldUseApi()) return [];
    try {
      return await request('/admin/banners', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return [];
      }
      throw error;
    }
  },
  createBanner: async (payload: Partial<Banner>) => {
    return request('/admin/banners', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateBanner: async (id: string, payload: Partial<Banner>) => {
    return request(`/admin/banners/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  deleteBanner: async (id: string) => {
    return request(`/admin/banners/${id}`, { method: 'DELETE' });
  },
  getHomeSections: async (signal?: AbortSignal): Promise<HomeSection[]> => {
    if (!shouldUseApi()) return [];
    try {
      return await request('/admin/home-sections', { signal });
    } catch (error) {
      if (error instanceof HttpError && error.isNetworkError) {
        return [];
      }
      throw error;
    }
  },
  createHomeSection: async (payload: Partial<HomeSection>) => {
    return request('/admin/home-sections', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateHomeSection: async (id: string, payload: Partial<HomeSection>) => {
    return request(`/admin/home-sections/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  deleteHomeSection: async (id: string) => {
    return request(`/admin/home-sections/${id}`, { method: 'DELETE' });
  },
};
