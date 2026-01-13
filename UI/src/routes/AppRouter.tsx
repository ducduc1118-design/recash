import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { routePaths } from './routePaths';
import { RequireAdmin, RequireAuth } from './guards';
import { UserLayout } from '@/layouts/UserLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { HomePage } from '@/pages/user/HomePage';
import { VoucherPage } from '@/pages/user/VoucherPage';
import { PasteLinkPage } from '@/pages/user/PasteLinkPage';
import { WalletPage } from '@/pages/user/WalletPage';
import { OrdersPage } from '@/pages/user/OrdersPage';
import { WithdrawPage } from '@/pages/user/WithdrawPage';
import { AccountPage } from '@/pages/user/AccountPage';
import { ProfilePage } from '@/pages/user/ProfilePage';
import { ReferralPage } from '@/pages/user/ReferralPage';
import { CheckinPage } from '@/pages/user/CheckinPage';
import { SupportPage } from '@/pages/user/SupportPage';
import { LoginPage } from '@/pages/user/LoginPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { UsersPage } from '@/pages/admin/UsersPage';
import { StoresPage } from '@/pages/admin/StoresPage';
import { OffersPage } from '@/pages/admin/OffersPage';
import { AdminOrdersPage } from '@/pages/admin/OrdersPage';
import { WithdrawalsPage } from '@/pages/admin/WithdrawalsPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';
import { BannersPage } from '@/pages/admin/BannersPage';
import { HomeSectionsPage } from '@/pages/admin/HomeSectionsPage';

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={routePaths.user.home} replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <UserLayout />
          </RequireAuth>
        }
      >
        <Route path={routePaths.user.home} element={<HomePage />} />
        <Route path={routePaths.user.voucher} element={<VoucherPage />} />
        <Route path={routePaths.user.pasteLink} element={<PasteLinkPage />} />
        <Route path={routePaths.user.wallet} element={<WalletPage />} />
        <Route path={routePaths.user.orders} element={<OrdersPage />} />
        <Route path={routePaths.user.withdraw} element={<WithdrawPage />} />
        <Route path={routePaths.user.account} element={<AccountPage />} />
        <Route path={routePaths.user.profile} element={<ProfilePage />} />
        <Route path={routePaths.user.referral} element={<ReferralPage />} />
        <Route path={routePaths.user.checkin} element={<CheckinPage />} />
        <Route path={routePaths.user.support} element={<SupportPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to={routePaths.admin.dashboard} replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="stores" element={<StoresPage />} />
        <Route path="offers" element={<OffersPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="withdrawals" element={<WithdrawalsPage />} />
        <Route path="banners" element={<BannersPage />} />
        <Route path="home-sections" element={<HomeSectionsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={routePaths.user.home} replace />} />
    </Routes>
  </BrowserRouter>
);
