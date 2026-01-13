import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { NotificationPanel } from './components/NotificationPanel';
import { ProfileMenu } from './components/ProfileMenu';
import { Toast } from '@/components/ui';
import { routePaths } from '@/routes/routePaths';
import { authService } from '@/services/auth.service';
import { notificationsService } from '@/services/notifications.service';
import type { Notification, User } from '@/types/domain';
import { MOCK_NOTIFICATIONS, MOCK_USER } from '@/mocks/data';
import { getStoredUser, isDemoMode } from '@/lib/auth';
import { HttpError } from '@/lib/httpError';

const subPagePaths = [
  routePaths.user.orders,
  routePaths.user.withdraw,
  routePaths.user.support,
  routePaths.user.profile,
  routePaths.user.referral,
  routePaths.user.checkin,
];

export const UserLayout: React.FC = () => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User>(getStoredUser<User>() || MOCK_USER);
  const [notifications, setNotifications] = useState<Notification[]>(isDemoMode() ? MOCK_NOTIFICATIONS : []);
  const [toast, setToast] = useState({ show: false, message: '' });
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const [userData, notifData] = await Promise.all([
          authService.me(controller.signal),
          notificationsService.getNotifications(controller.signal),
        ]);
        setUser(userData as User);
        setNotifications(notifData);
      } catch (error) {
        if (error instanceof HttpError && (error.status === 401 || error.status === 403)) {
          authService.logout().catch(() => undefined);
          navigate('/login');
          return;
        }
        setToast({ show: true, message: 'Unable to refresh account data.' });
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const isSubPage = subPagePaths.includes(pathname);
  const showChrome = !isSubPage;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-100">
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />

      {showChrome && (
        <Header 
          notifications={notifications}
          user={user}
          onOpenNotifications={() => setIsNotifOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      )}

      <main className="animate-in fade-in duration-300">
        <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${showChrome ? 'lg:flex lg:gap-6' : ''}`}>
          {showChrome && <Sidebar />}
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </main>

      {showChrome && <BottomNav />}

      <NotificationPanel 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
        notifications={notifications} 
      />

      <ProfileMenu 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={user} 
      />

      {isProfileOpen && user.role === 'admin' && (
        <div className="fixed top-[260px] right-4 w-64 z-[62] px-2 pointer-events-none">
          <button 
             onClick={() => {
               setIsProfileOpen(false);
               navigate(routePaths.admin.dashboard);
             }}
             className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-white bg-slate-900 shadow-lg pointer-events-auto hover:bg-slate-800 transition-colors animate-in slide-in-from-right-2 min-h-[44px]"
          >
             <ShieldCheck className="w-4 h-4" />
             <span>Switch to Admin Panel</span>
          </button>
        </div>
      )}
    </div>
  );
};
