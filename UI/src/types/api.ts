import type {
  Store,
  Voucher,
  WalletSummary,
  LedgerEntry,
  Order,
  OrderStatus,
  Notification,
  Ticket,
  User,
  Referral,
  Banner,
  HomeSection,
} from './domain';

export type GetStoresResponse = Store[];
export type GetVouchersResponse = Voucher[];

export interface CreateLinkRequest {
  url: string;
}

export interface CreateLinkResponse {
  store: Store;
  cashback: number;
}

export type GetWalletResponse = WalletSummary;
export type GetLedgerResponse = LedgerEntry[];

export interface GetOrdersParams {
  status?: OrderStatus;
}

export type GetOrdersResponse = Order[];
export type GetOrderResponse = Order;

export interface CreateWithdrawalRequest {
  amount: number;
  method: 'bank' | 'ewallet';
}

export type GetNotificationsResponse = Notification[];

export type GetSupportTicketsResponse = Ticket[];

export interface CreateSupportTicketRequest {
  subject: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export type GetMeResponse = User;

export interface UpdateMeRequest {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export type GetReferralResponse = Referral[];

export interface CheckinStatusResponse {
  streak: number;
  checkedIn: boolean;
}

export interface GetAdminDashboardResponse {
  totalUsers: number;
  totalRevenue: string;
  pendingCashout: string;
  activeOffers: number;
}

export interface GetHomeResponse {
  banners: Banner[];
  sections: HomeSection[];
}
