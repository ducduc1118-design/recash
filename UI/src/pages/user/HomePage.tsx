import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Flame } from 'lucide-react';
import { Button, AppCard, SkeletonList, Skeleton, Toast } from '@/components/ui';
import { PageLayout } from './PageLayout';
import { storesService } from '@/services/stores.service';
import { vouchersService } from '@/services/vouchers.service';
import { walletService } from '@/services/wallet.service';
import { checkinService } from '@/services/checkin.service';
import { homeService } from '@/services/home.service';
import type { Banner, Store, Voucher } from '@/types/domain';
import type { WalletSummary } from '@/types/domain';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [streak, setStreak] = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [wallet, setWallet] = useState<WalletSummary>({
    balance: '$0.00',
    pending: '$0.00',
    lifetime: '$0.00',
  });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const [homeData, storeData, voucherData, walletData, checkinData] = await Promise.all([
          homeService.getHome(controller.signal),
          storesService.getStores(controller.signal),
          vouchersService.getVouchers(controller.signal),
          walletService.getWallet(controller.signal),
          checkinService.getStatus(controller.signal),
        ]);
        const orderedBanners = (homeData?.banners || [])
          .filter((banner) => banner.isActive !== false)
          .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
        setBanners(orderedBanners);
        setStores(storeData);
        setVouchers(voucherData);
        setWallet(walletData);
        setStreak(checkinData.streak);
        setCheckedIn(checkinData.checkedIn);
      } catch {
        setToast({ show: true, message: 'Some data failed to load.' });
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setToast({ show: true, message: 'Code copied to clipboard!' });
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleCheckIn = () => {
    setCheckedIn(true);
    setStreak((s) => s + 1);
    setToast({ show: true, message: 'Checked in successfully! +10 pts' });
  };

  return (
    <PageLayout>
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl shadow-slate-900/20 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex justify-between items-start mb-6 relative z-10">
             <div>
               <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{t('home.availableBalance')}</p>
               <h2 className="text-3xl font-bold tracking-tight">{wallet.balance}</h2>
             </div>
             <Button size="xs" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md">
               {t('home.withdraw')}
             </Button>
          </div>
          <div className="flex space-x-6 relative z-10">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">{t('home.pending')}</p>
              <p className="text-sm font-semibold text-yellow-400">{wallet.pending}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">{t('home.withdrawn')}</p>
              <p className="text-sm font-semibold">{wallet.lifetime}</p>
            </div>
          </div>
        </div>

        <AppCard className="flex items-center justify-between bg-gradient-to-br from-white to-slate-50 border-slate-200">
           <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
               <Calendar className="w-5 h-5" />
             </div>
             <div>
               <h3 className="font-bold text-slate-900 text-sm">{t('home.dailyCheckin')}</h3>
               <div className="flex items-center text-xs text-slate-500 font-medium">
                 <Flame className="w-3 h-3 text-orange-500 mr-1" fill="currentColor" />
                 {streak} {t('home.dayStreak')}
               </div>
             </div>
           </div>
           <Button 
              size="sm" 
              variant={checkedIn ? "secondary" : "primary"}
              disabled={checkedIn}
              onClick={handleCheckIn}
           >
             {checkedIn ? t('home.done') : t('home.checkIn')}
           </Button>
        </AppCard>
      </div>

      {(loading || banners.length > 0) && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-bold text-slate-900">{t('home.featuredDeals')}</h3>
          </div>
          {loading ? (
            <Skeleton className="h-32 w-full rounded-2xl" />
          ) : (
            <div className="flex overflow-x-auto space-x-3 pb-2 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 no-scrollbar snap-x">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className={`flex-shrink-0 w-[85%] sm:w-[300px] h-36 rounded-2xl p-5 flex flex-col justify-center snap-center shadow-lg ${banner.bgClass} ${banner.textClass}`}
                >
                  <h4 className="font-bold text-xl mb-1">{banner.title}</h4>
                  <p className="opacity-90 text-sm">{banner.subtitle}</p>
                  <button className="mt-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm w-fit px-3 py-1 rounded-lg text-xs font-bold transition-colors">
                    {banner.ctaText || t('home.shop')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mb-8">
        <h3 className="font-bold text-slate-900 mb-4 px-1">{t('home.topStores')}</h3>
        <div className="grid grid-cols-4 gap-y-6 gap-x-2">
           {stores.map(store => (
             <div key={store.id} className="flex flex-col items-center group cursor-pointer">
               <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mb-2 shadow-sm group-hover:scale-105 transition-transform ${store.color}`}>
                 {store.initials}
               </div>
               <span className="text-xs font-medium text-slate-900 mb-0.5">{store.name}</span>
               <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-full">
                 Up to {store.cashbackUpTo}%
               </span>
             </div>
           ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-slate-900 mb-4 px-1 flex items-center">
          {t('home.hotVouchers')} <Flame className="w-4 h-4 text-orange-500 ml-1" fill="currentColor" />
        </h3>
        {loading ? (
          <SkeletonList count={3} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {vouchers.filter((v) => v.isHot).map(voucher => {
               const store = stores.find(s => s.id === voucher.storeId);
               return (
                 <AppCard key={voucher.id} className="flex items-center space-x-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${store?.color}`}>
                     {store?.initials}
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center space-x-2 mb-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{store?.name}</span>
                        <span className="text-[10px] text-red-500 bg-red-50 px-1 rounded font-medium">{voucher.expiry}</span>
                     </div>
                     <h4 className="font-bold text-slate-900 text-sm truncate">{voucher.title}</h4>
                   </div>
                   <div className="flex flex-col space-y-2 flex-shrink-0">
                      <Button 
                        size="xs" 
                        variant={copiedId === voucher.id ? "secondary" : "outline"} 
                        className={copiedId === voucher.id ? "text-green-600 bg-green-50 border-green-200" : ""}
                        onClick={() => handleCopy(voucher.code, voucher.id)}
                      >
                         {copiedId === voucher.id ? t('home.copied') : t('home.copy')}
                      </Button>
                      <Button size="xs">{t('home.shop')}</Button>
                   </div>
                 </AppCard>
               );
             })}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
