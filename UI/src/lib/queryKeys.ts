export const queryKeys = {
  vouchers: ['vouchers'] as const,
  stores: ['stores'] as const,
  wallet: ['wallet'] as const,
  ledger: ['ledger'] as const,
  orders: ['orders'] as const,
  order: (id: string) => ['orders', id] as const,
};
