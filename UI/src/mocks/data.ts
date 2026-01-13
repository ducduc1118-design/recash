import type {
  Banner,
  Checkin,
  FAQItem,
  LedgerEntry,
  Notification,
  Order,
  Referral,
  Store,
  Ticket,
  User,
  Voucher,
  WalletSummary,
  WithdrawalRequest,
} from '../types/domain';

export const MOCK_USER: User = {
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  phone: '+1 (555) 000-1234',
  avatarUrl: 'https://picsum.photos/100',
  balance: '$1,240.50',
  points: 1250,
  role: 'admin',
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Cashback Received',
    message: 'You received $12.50 from Nike Store.',
    time: '2m ago',
    read: false,
    type: 'success',
  },
  {
    id: '2',
    title: 'New Voucher Available',
    message: 'Check out the new 20% off Adidas voucher.',
    time: '2h ago',
    read: true,
    type: 'info',
  },
  {
    id: '3',
    title: 'Security Alert',
    message: 'New login detected from Mac OS X.',
    time: '1d ago',
    read: true,
    type: 'alert',
  },
];

export const MOCK_STORES: Store[] = [
  { id: '1', name: 'Amazon', initials: 'Am', color: 'bg-orange-100 text-orange-600', cashbackUpTo: 12 },
  { id: '2', name: 'Nike', initials: 'Ni', color: 'bg-slate-100 text-slate-800', cashbackUpTo: 8 },
  { id: '3', name: 'Adidas', initials: 'Ad', color: 'bg-slate-900 text-white', cashbackUpTo: 10 },
  { id: '4', name: 'Sephora', initials: 'Se', color: 'bg-pink-100 text-pink-600', cashbackUpTo: 15 },
  { id: '5', name: 'eBay', initials: 'eB', color: 'bg-blue-100 text-blue-600', cashbackUpTo: 5 },
  { id: '6', name: 'Target', initials: 'Ta', color: 'bg-red-100 text-red-600', cashbackUpTo: 4 },
  { id: '7', name: 'Zara', initials: 'Za', color: 'bg-neutral-100 text-neutral-800', cashbackUpTo: 6 },
  { id: '8', name: 'BestBuy', initials: 'BB', color: 'bg-yellow-100 text-yellow-600', cashbackUpTo: 3 },
];

export const MOCK_VOUCHERS: Voucher[] = [
  { id: 'v1', storeId: '2', title: '20% Off Footwear', code: 'NIKE2024', expiry: '2d left', type: 'percent', category: 'Fashion', isHot: true },
  { id: 'v2', storeId: '1', title: '$10 Off Electronics', code: 'TECHSAVE10', expiry: '5h left', type: 'fixed', category: 'Tech', isHot: true },
  { id: 'v3', storeId: '4', title: 'Free Shipping > $50', code: 'SHIPFREE', expiry: '1w left', type: 'shipping', category: 'Fashion' },
  { id: 'v4', storeId: '3', title: '15% Off Everything', code: 'ADI15', expiry: '3d left', type: 'percent', category: 'Fashion', isHot: true },
  { id: 'v5', storeId: '6', title: '5% Cash Back Bonus', code: 'TARGET5', expiry: '1d left', type: 'percent', category: 'Food' },
  { id: 'v6', storeId: '5', title: '$5 Off First Order', code: 'EBAYNEW', expiry: '12h left', type: 'fixed', category: 'Tech' },
];

export const MOCK_BANNERS: Banner[] = [
  { id: 'b1', title: 'Super Brand Day', subtitle: 'Up to 50% Cashback', bgClass: 'bg-gradient-to-r from-blue-500 to-indigo-600', textClass: 'text-white' },
  { id: 'b2', title: 'Fashion Week', subtitle: 'Double Points on Zara', bgClass: 'bg-gradient-to-r from-pink-500 to-rose-500', textClass: 'text-white' },
  { id: 'b3', title: 'Tech Monday', subtitle: 'Extra 5% at BestBuy', bgClass: 'bg-gradient-to-r from-yellow-400 to-amber-500', textClass: 'text-slate-900' },
];

export const MOCK_LEDGER: LedgerEntry[] = [
  { id: 't1', title: 'Cashback from Nike', date: 'Today, 10:30 AM', amount: '+$12.50', type: 'earning', status: 'pending' },
  { id: 't2', title: 'Withdrawal to Bank', date: 'Yesterday', amount: '-$50.00', type: 'withdrawal', status: 'completed' },
  { id: 't3', title: 'Daily Check-in Bonus', date: 'Yesterday', amount: '+$0.50', type: 'bonus', status: 'completed' },
  { id: 't4', title: 'Cashback from Amazon', date: 'Oct 24', amount: '+$5.20', type: 'earning', status: 'completed' },
  { id: 't5', title: 'Referral Bonus', date: 'Oct 20', amount: '+$10.00', type: 'bonus', status: 'completed' },
];

export const MOCK_WALLET_SUMMARY: WalletSummary = {
  balance: '$1,240.50',
  pending: '$45.00',
  lifetime: '$1,740.00',
};

export const MOCK_ORDERS: Order[] = [
  { 
    id: 'o1', storeName: 'Nike', orderNumber: 'NKE-883921', date: 'Oct 28, 2023', amount: '$125.00', cashback: '$12.50', status: 'Pending',
    timeline: [
      { status: 'Clicked', date: 'Oct 28, 10:00 AM', completed: true },
      { status: 'Tracked', date: 'Oct 28, 10:15 AM', completed: true },
      { status: 'Approved', date: 'Est. Nov 5', completed: false },
      { status: 'Available', date: 'Est. Nov 12', completed: false },
    ]
  },
  { 
    id: 'o2', storeName: 'Amazon', orderNumber: 'AMZ-11234', date: 'Oct 24, 2023', amount: '$52.00', cashback: '$5.20', status: 'Available',
    timeline: [
      { status: 'Clicked', date: 'Oct 24, 02:00 PM', completed: true },
      { status: 'Tracked', date: 'Oct 24, 02:05 PM', completed: true },
      { status: 'Approved', date: 'Oct 26', completed: true },
      { status: 'Available', date: 'Oct 27', completed: true },
    ]
  },
  { 
    id: 'o3', storeName: 'Adidas', orderNumber: 'ADI-5592', date: 'Oct 15, 2023', amount: '$200.00', cashback: '$20.00', status: 'Rejected',
    timeline: [
      { status: 'Clicked', date: 'Oct 15, 09:00 AM', completed: true },
      { status: 'Tracked', date: 'Oct 15, 09:10 AM', completed: true },
      { status: 'Rejected', date: 'Oct 16', completed: true },
    ]
  },
];

export const MOCK_FAQS: FAQItem[] = [
  { id: '1', question: 'How long does cashback take?', answer: 'It usually takes 48 hours to track and 30-60 days to verify depending on the store\'s return policy.', category: 'Cashback' },
  { id: '2', question: 'Why was my cashback rejected?', answer: 'This can happen if you returned items, used unapproved coupons, or didn\'t complete the purchase in the same session.', category: 'Cashback' },
  { id: '3', question: 'How do I withdraw money?', answer: 'Go to Wallet > Withdraw. You need a minimum of $10 confirmed cashback to withdraw.', category: 'Withdrawals' },
  { id: '4', question: 'Can I refer friends?', answer: 'Yes! Go to Account > Invite Friends. You earn $10 for every friend who makes their first purchase.', category: 'Account' },
];

export const MOCK_TICKETS: Ticket[] = [
  { id: '1', subject: 'Missing cashback from Sephora', status: 'Open', date: 'Oct 28', lastMessage: 'We are checking with the merchant.' },
  { id: '2', subject: 'Withdrawal delay', status: 'Resolved', date: 'Oct 15', lastMessage: 'Funds have been processed.' },
];

export const MOCK_REFERRALS: Referral[] = [
  { id: '1', name: 'Sarah Miller', status: 'Shopped', earnings: '$10.00', date: 'Oct 20' },
  { id: '2', name: 'Mike Ross', status: 'Registered', earnings: '$0.00', date: 'Oct 25' },
];

export const MOCK_CHECKINS: Checkin[] = [
  { id: '1', activity: 'Daily Check-in', points: 10, date: 'Today' },
  { id: '2', activity: 'Shop at Nike', points: 50, date: 'Yesterday' },
  { id: '3', activity: 'Daily Check-in', points: 10, date: 'Yesterday' },
];

export const MOCK_ADMIN_USER: User = {
  name: 'Admin User',
  email: 'admin@recash.com',
  phone: '',
  avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
  balance: '0',
  points: 0,
  role: 'admin',
};

export const MOCK_ADMIN_USERS = [
  { id: '1', name: 'Alex Johnson', email: 'alex.j@example.com', balance: '$1,240.50', status: 'Active', joined: 'Oct 12, 2023' },
  { id: '2', name: 'Sarah Miller', email: 'sarah.m@example.com', balance: '$450.00', status: 'Active', joined: 'Oct 15, 2023' },
  { id: '3', name: 'Mike Ross', email: 'mike.r@example.com', balance: '$0.00', status: 'Banned', joined: 'Oct 20, 2023' },
];

export const MOCK_WITHDRAWALS: WithdrawalRequest[] = [
  { id: 'w1', user: 'Alex Johnson', method: 'Chase Bank', details: '**** 4432', amount: '$100.00', date: 'Oct 28', status: 'Pending' },
  { id: 'w2', user: 'Sarah Miller', method: 'PayPal', details: 'sarah.m@example.com', amount: '$50.00', date: 'Oct 27', status: 'Approved' },
];

export const MOCK_ADMIN_ORDERS: Order[] = [
  { id: 'o1', user: 'Alex Johnson', storeName: 'Nike', orderNumber: 'NKE-883921', date: 'Oct 28', amount: '$125.00', cashback: '$12.50', status: 'Pending', timeline: [] },
  { id: 'o2', user: 'Sarah Miller', storeName: 'Amazon', orderNumber: 'AMZ-11234', date: 'Oct 24', amount: '$52.00', cashback: '$5.20', status: 'Available', timeline: [] },
];
