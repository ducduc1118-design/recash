import React, { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, HelpCircle, Plus, ShoppingBag, Ticket } from 'lucide-react';
import { Button, SkeletonList, Toast } from '@/components/ui';
import { PageLayout } from './PageLayout';
import { walletService } from '@/services/wallet.service';
import type { LedgerEntry, WalletSummary } from '@/types/domain';
import { routePaths } from '@/routes/routePaths';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [summary, setSummary] = useState<WalletSummary>({
    balance: '$0.00',
    pending: '$0.00',
    lifetime: '$0.00',
  });
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const [walletData, ledgerData] = await Promise.all([
          walletService.getWallet(controller.signal),
          walletService.getLedger(controller.signal),
        ]);
        setSummary(walletData);
        setLedger(ledgerData);
      } catch {
        setToast({ show: true, message: 'Unable to load wallet data.' });
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  return (
    <PageLayout 
      title={t('wallet.title')} 
      actions={
        <Button size="sm" variant="outline" onClick={() => navigate(routePaths.user.support)}>
           <HelpCircle className="w-4 h-4 mr-1" /> {t('wallet.help')}
        </Button>
      }
    >
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="relative z-10">
              <p className="text-slate-400 text-sm font-medium mb-1">{t('wallet.totalBalance')}</p>
              <h2 className="text-4xl font-bold mb-8">{summary.balance}</h2>
              
              <div className="flex justify-between items-end">
                 <div className="flex space-x-6">
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Pending</p>
                      <p className="text-sm font-semibold text-yellow-400">{summary.pending}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Lifetime</p>
                      <p className="text-sm font-semibold">{summary.lifetime}</p>
                    </div>
                 </div>
                 <Button 
                   size="sm" 
                   className="bg-white text-slate-900 hover:bg-slate-100 border-none shadow-lg"
                   onClick={() => navigate(routePaths.user.withdraw)}
                 >
                   {t('home.withdraw')}
                 </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" className="h-auto py-4 flex-col gap-2" onClick={() => navigate(routePaths.user.orders)}>
              <ShoppingBag className="w-6 h-6 text-primary-600" />
              <span>{t('wallet.myOrders')}</span>
            </Button>
            <Button variant="secondary" className="h-auto py-4 flex-col gap-2" onClick={() => navigate(routePaths.user.voucher)}>
              <Ticket className="w-6 h-6 text-orange-500" />
              <span>{t('wallet.myVouchers')}</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900">{t('wallet.history')}</h3>
          <div className="space-y-4">
             {loading ? (
               <SkeletonList count={4} />
             ) : ledger.map(t => (
               <div key={t.id} className="flex items-center justify-between p-1">
                 <div className="flex items-center space-x-4">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                     t.type === 'earning' ? 'bg-green-100 text-green-600' : 
                     t.type === 'withdrawal' ? 'bg-slate-100 text-slate-600' : 'bg-purple-100 text-purple-600'
                   }`}>
                     {t.type === 'earning' ? <ArrowDownLeft className="w-5 h-5" /> : 
                      t.type === 'withdrawal' ? <ArrowUpRight className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-900">{t.title}</p>
                     <p className="text-xs text-slate-500">{t.date}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className={`text-sm font-bold ${t.type === 'withdrawal' ? 'text-slate-900' : 'text-green-600'}`}>{t.amount}</p>
                   <p className="text-[10px] text-slate-400 capitalize">{t.status}</p>
                 </div>
               </div>
             ))}
          </div>
          <Button variant="ghost" className="w-full mt-2 text-xs">{t('wallet.viewAll')}</Button>
        </div>
      </div>
    </PageLayout>
  );
};
