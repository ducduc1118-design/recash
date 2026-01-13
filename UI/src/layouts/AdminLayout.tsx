import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { AdminSidebar } from './components/AdminSidebar';
import { Button, Modal } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/auth.service';

export const AdminLayout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const sidebarItems = [
    { label: t('admin.dashboard'), path: '/admin/dashboard' },
    { label: t('admin.users'), path: '/admin/users' },
    { label: t('admin.stores'), path: '/admin/stores' },
    { label: t('admin.offers'), path: '/admin/offers' },
    { label: t('admin.orders'), path: '/admin/orders' },
    { label: t('admin.withdrawals'), path: '/admin/withdrawals' },
    { label: t('admin.banners'), path: '/admin/banners' },
    { label: t('admin.homeSections'), path: '/admin/home-sections' },
    { label: t('admin.settings'), path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      navigate('/login');
    }
  };

  return (
  <div className="min-h-screen bg-slate-50 flex flex-row font-sans">
    <AdminSidebar />

    <div className="flex-1 md:ml-64 flex flex-col min-w-0">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
        <div className="flex items-center gap-3 flex-1 max-w-md relative">
          <button
            className="md:hidden p-2 text-slate-500 hover:text-slate-700"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={t('admin.search')}
            className="w-full h-10 pl-10 pr-4 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all outline-none"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/home')}>
            {t('admin.backToApp')}
          </Button>
          <button className="relative p-2 text-slate-400 hover:text-slate-600">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="h-8 w-px bg-slate-200" />
          <Button variant="ghost" size="sm" className="text-slate-500" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> {t('admin.logout')}
          </Button>
        </div>
      </header>

      <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>

    <Modal
      isOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      className="md:hidden !items-stretch !justify-start"
    >
      <div className="h-full w-[280px] bg-white shadow-2xl rounded-none p-4">
        <div className="mb-4 font-bold text-slate-900">RECASH Admin</div>
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setDrawerOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </Modal>
  </div>
  );
};
