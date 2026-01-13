import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store as StoreIcon,
  Tag,
  ShoppingBag,
  Wallet,
  Image,
  LayoutGrid,
  Settings,
} from 'lucide-react';
import { MOCK_USER } from '@/mocks/data';
import { getStoredUser } from '@/lib/auth';
import type { User as UserProfile } from '@/types/domain';
import { useTranslation } from 'react-i18next';

export const AdminSidebar: React.FC = () => {
  const { t } = useTranslation();
  const storedUser = getStoredUser<UserProfile>() || MOCK_USER;
  const sidebarItems = [
    { label: t('admin.dashboard'), path: '/admin/dashboard', icon: LayoutDashboard },
    { label: t('admin.users'), path: '/admin/users', icon: Users },
    { label: t('admin.stores'), path: '/admin/stores', icon: StoreIcon },
    { label: t('admin.offers'), path: '/admin/offers', icon: Tag },
    { label: t('admin.orders'), path: '/admin/orders', icon: ShoppingBag },
    { label: t('admin.withdrawals'), path: '/admin/withdrawals', icon: Wallet },
    { label: t('admin.banners'), path: '/admin/banners', icon: Image },
    { label: t('admin.homeSections'), path: '/admin/home-sections', icon: LayoutGrid },
    { label: t('admin.settings'), path: '/admin/settings', icon: Settings },
  ];

  return (
  <aside className="w-64 bg-slate-900 text-white fixed h-full z-20 hidden md:flex flex-col">
    <div className="h-16 flex items-center px-6 border-b border-slate-800">
      <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
        <span className="font-bold text-lg">R</span>
      </div>
      <span className="font-bold text-xl tracking-tight">RECASH Admin</span>
    </div>
    
    <nav className="flex-1 py-6 px-3 space-y-1">
      {sidebarItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="p-4 border-t border-slate-800">
      <div className="flex items-center space-x-3">
        <img src={storedUser.avatarUrl} className="w-9 h-9 rounded-full bg-slate-700" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{storedUser.name}</p>
          <p className="text-xs text-slate-500 truncate">{storedUser.email}</p>
        </div>
      </div>
    </div>
  </aside>
  );
};
