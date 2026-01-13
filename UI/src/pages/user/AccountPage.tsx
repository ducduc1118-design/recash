import React, { useEffect, useState } from 'react';
import { Bell, ChevronRight, Gift, HelpCircle, Link as LinkIcon, LogOut, ShieldCheck, ShoppingBag, User, Users, Wallet } from 'lucide-react';
import { Button, Switch, Toast } from '@/components/ui';
import { PageLayout } from './PageLayout';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '@/routes/routePaths';
import { authService } from '@/services/auth.service';
import type { User as UserProfile } from '@/types/domain';
import { useTranslation } from 'react-i18next';
import { setLanguage } from '@/i18n';
import { getStoredUser } from '@/lib/auth';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [notify, setNotify] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser<UserProfile>() ?? null);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await authService.me(controller.signal);
        setUser(data);
      } catch {
        setToast({ show: true, message: 'Unable to load profile.' });
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      setToast({ show: true, message: 'Unable to log out.' });
    } finally {
      navigate(routePaths.user.login);
    }
  };

  return (
    <PageLayout title={t('account.title')}>
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative">
          <img 
            src={user?.avatarUrl || 'https://picsum.photos/200'} 
            alt="Profile" 
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8.25 8.25a1 1 0 01-1.414 0l-3.75-3.75a1 1 0 111.414-1.414L7.5 12.586l7.543-7.543a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Alex Johnson'}</h2>
          <p className="text-slate-500 text-sm">{user?.email || 'alex.j@example.com'}</p>
          <div className="mt-2 flex space-x-2">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">Premium Member</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 pl-1">{t('account.walletCashback')}</h3>
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 shadow-soft overflow-hidden">
             <button 
               className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
               onClick={() => navigate(routePaths.user.wallet)}
             >
               <div className="flex items-center space-x-3">
                 <Wallet className="w-5 h-5 text-primary-500" />
                 <span className="text-slate-700 font-medium">{t('account.myWallet')}</span>
               </div>
               <div className="flex items-center space-x-2">
                 <span className="text-sm font-bold text-slate-900">$1,240.50</span>
                 <ChevronRight className="w-4 h-4 text-slate-300" />
               </div>
             </button>
             <button 
               className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
               onClick={() => navigate(routePaths.user.orders)}
             >
               <div className="flex items-center space-x-3">
                 <ShoppingBag className="w-5 h-5 text-orange-500" />
                 <span className="text-slate-700 font-medium">{t('account.myOrders')}</span>
               </div>
               <ChevronRight className="w-4 h-4 text-slate-300" />
             </button>
             <button 
               className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
               onClick={() => navigate(routePaths.user.pasteLink)}
             >
               <div className="flex items-center space-x-3">
                 <LinkIcon className="w-5 h-5 text-blue-500" />
                 <span className="text-slate-700 font-medium">{t('account.savedLinks')}</span>
               </div>
               <ChevronRight className="w-4 h-4 text-slate-300" />
             </button>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 pl-1">{t('account.growth')}</h3>
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 shadow-soft overflow-hidden">
             <button 
               className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
               onClick={() => navigate(routePaths.user.checkin)}
             >
               <div className="flex items-center space-x-3">
                 <Gift className="w-5 h-5 text-pink-500" />
                 <span className="text-slate-700 font-medium">{t('account.dailyCheckin')}</span>
               </div>
               <div className="flex items-center space-x-2">
                 <span className="text-xs bg-pink-50 text-pink-600 font-bold px-2 py-0.5 rounded-full">1,250 Pts</span>
                 <ChevronRight className="w-4 h-4 text-slate-300" />
               </div>
             </button>
             <button 
               className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
               onClick={() => navigate(routePaths.user.referral)}
             >
               <div className="flex items-center space-x-3">
                 <Users className="w-5 h-5 text-indigo-500" />
                 <span className="text-slate-700 font-medium">{t('account.referFriends')}</span>
               </div>
               <ChevronRight className="w-4 h-4 text-slate-300" />
             </button>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 pl-1">{t('account.settingsSupport')}</h3>
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 shadow-soft overflow-hidden">
             {user?.role === 'admin' && (
               <button 
                 className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                 onClick={() => navigate(routePaths.admin.dashboard)}
               >
                 <div className="flex items-center space-x-3">
                   <ShieldCheck className="w-5 h-5 text-slate-500" />
                   <span className="text-slate-700 font-medium">{t('account.adminPanel')}</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-300" />
               </button>
             )}
             <button 
               className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
               onClick={() => navigate(routePaths.user.profile)}
             >
               <div className="flex items-center space-x-3">
                 <User className="w-5 h-5 text-slate-500" />
                 <span className="text-slate-700 font-medium">{t('account.myProfile')}</span>
               </div>
               <ChevronRight className="w-4 h-4 text-slate-300" />
             </button>
             <button 
               className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
               onClick={() => navigate(routePaths.user.support)}
             >
               <div className="flex items-center space-x-3">
                 <HelpCircle className="w-5 h-5 text-slate-500" />
                 <span className="text-slate-700 font-medium">{t('account.helpCenter')}</span>
               </div>
               <ChevronRight className="w-4 h-4 text-slate-300" />
             </button>
             <div className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
               <div className="flex items-center space-x-3">
                 <Bell className="w-5 h-5 text-slate-500" />
                 <span className="text-slate-700 font-medium">{t('account.notifications')}</span>
               </div>
               <Switch checked={notify} onCheckedChange={setNotify} />
             </div>
             <div className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
               <div className="flex items-center space-x-3">
                 <span className="w-5 h-5 text-slate-500 inline-flex items-center justify-center font-bold">A</span>
                 <span className="text-slate-700 font-medium">{t('account.language')}</span>
               </div>
               <select
                 value={i18n.language.startsWith('en') ? 'en' : 'vi'}
                 onChange={(e) => setLanguage(e.target.value as 'vi' | 'en')}
                 className="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1"
               >
                 <option value="vi">{t('lang.vi')}</option>
                 <option value="en">{t('lang.en')}</option>
               </select>
             </div>
          </div>
        </section>

        <Button variant="danger" className="w-full justify-between px-4" size="lg" onClick={handleLogout}>
           <span>{t('account.logout')}</span>
           <LogOut className="w-5 h-5 opacity-70" />
        </Button>
        <div className="h-4"/>
        <p className="text-center text-xs text-slate-300">RECASH v1.0.0</p>
        <div className="h-8"/>
      </div>
    </PageLayout>
  );
};
