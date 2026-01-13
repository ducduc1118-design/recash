export type UserRole = 'user' | 'admin';

export interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  balance?: string;
  points?: number;
  role?: UserRole;
}

export interface Store {
  id: string;
  name: string;
  initials: string;
  color: string;
  cashbackUpTo: number;
}

export type VoucherType = 'percent' | 'fixed' | 'shipping';
export type VoucherCategory = 'Fashion' | 'Tech' | 'Food' | 'Travel';

export interface Voucher {
  id: string;
  storeId: string;
  title: string;
  code: string;
  expiry: string;
  type: VoucherType;
  category: VoucherCategory;
  isHot?: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  bgClass: string;
  textClass: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  isActive?: boolean;
  priority?: number;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export type LedgerType = 'earning' | 'withdrawal' | 'bonus';
export type LedgerStatus = 'pending' | 'completed' | 'failed';

export interface LedgerEntry {
  id: string;
  title: string;
  date: string;
  amount: string;
  type: LedgerType;
  status: LedgerStatus;
}

export interface WalletSummary {
  balance: string;
  pending: string;
  lifetime: string;
}

export type OrderStatus = 'Pending' | 'Reviewing' | 'Available' | 'Rejected';

export interface Order {
  id: string;
  storeName: string;
  orderNumber: string;
  date: string;
  amount: string;
  cashback: string;
  status: OrderStatus;
  user?: string;
  timeline: {
    status: string;
    date: string;
    completed: boolean;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface Ticket {
  id: string;
  subject: string;
  status: 'Open' | 'Resolved' | 'Closed';
  date: string;
  lastMessage: string;
  user?: string;
}

export interface Referral {
  id: string;
  name: string;
  status: 'Registered' | 'Shopped';
  earnings: string;
  date: string;
}

export interface Checkin {
  id: string;
  activity: string;
  points: number;
  date: string;
}

export interface WithdrawalRequest {
  id: string;
  user: string;
  method: string;
  details: string;
  amount: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface HomeSection {
  id: string;
  key: string;
  title: string;
  isActive: boolean;
  priority: number;
  config?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}
