import React, { useEffect, useState } from 'react';
import { Copy, Flame, Search, ChevronDown, ArrowRight } from 'lucide-react';
import { Button, AppCard, EmptyState, SkeletonList, Chip, Toast, Modal } from '@/components/ui';
import type { Store, Voucher } from '@/types/domain';
import { storesService } from '@/services/stores.service';
import { vouchersService } from '@/services/vouchers.service';
import { PageLayout } from './PageLayout';
import { useTranslation } from 'react-i18next';

export const VoucherPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [stores, setStores] = useState<Store[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const storeData = await storesService.getStores(controller.signal);
        setStores(storeData);
      } catch {
        setToast({ show: true, message: 'Unable to load stores.' });
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      try {
        const voucherData = await vouchersService.getVouchers(controller.signal, {
          search: searchTerm || undefined,
          category: activeFilter !== 'All' && activeFilter !== 'Free Ship' ? activeFilter : undefined,
          type: activeFilter === 'Free Ship' ? 'shipping' : undefined,
        });
        setVouchers(voucherData);
      } catch {
        setToast({ show: true, message: 'Unable to load vouchers.' });
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [activeFilter, searchTerm]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setToast({ show: true, message: 'Code copied!' });
  };

  const filters = ['All', 'Fashion', 'Tech', 'Food', 'Free Ship'];

  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) || v.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeFilter === 'All' 
      ? true 
      : activeFilter === 'Free Ship' 
        ? v.type === 'shipping' 
        : v.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout title={t('voucher.title')}>
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />

      <div className="sticky top-16 bg-slate-50/95 backdrop-blur-sm z-30 pt-2 pb-4 space-y-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-b border-slate-200/50 mb-4">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('voucher.searchPlaceholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
         </div>
         <div className="flex items-center justify-between">
            <div className="flex space-x-2 overflow-x-auto no-scrollbar mask-gradient-r">
               {filters.map(f => (
                 <Chip 
                   key={f} 
                   label={f} 
                   active={activeFilter === f} 
                   onClick={() => setActiveFilter(f)} 
                 />
               ))}
            </div>
            <button className="flex items-center space-x-1 text-xs font-bold text-slate-500 pl-3">
               <span>{t('voucher.sort')}</span>
               <ChevronDown className="w-3 h-3" />
            </button>
         </div>
      </div>

      {loading ? (
        <SkeletonList count={4} />
      ) : filteredVouchers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVouchers.map(voucher => {
            const store = stores.find(s => s.id === voucher.storeId);
            return (
              <AppCard 
                key={voucher.id} 
                className="cursor-pointer active:scale-[0.99] transition-transform"
                onClick={async () => {
                  setSelectedVoucher(voucher);
                  try {
                    const detail = await vouchersService.getVoucher(voucher.id);
                    setSelectedVoucher(detail);
                  } catch {
                    setToast({ show: true, message: 'Unable to load voucher details.' });
                  }
                }}
              >
                 <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${store?.color}`}>
                          {store?.initials}
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-900 text-sm">{store?.name}</h4>
                          <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">{voucher.category}</span>
                       </div>
                    </div>
                    {voucher.isHot && (
                      <div className="flex items-center space-x-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-full">
                        <Flame className="w-3 h-3" fill="currentColor" />
                        <span className="text-[10px] font-bold">HOT</span>
                      </div>
                    )}
                 </div>
                 <div className="pl-[52px]">
                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{voucher.title}</h3>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">Valid for all {voucher.category} items. Min spend $50. Cannot be combined with other offers.</p>
                    <div className="flex items-center justify-between bg-slate-50 p-1 pl-3 rounded-lg border border-slate-100 border-dashed">
                       <code className="text-xs font-bold text-slate-700 font-mono tracking-wider">{voucher.code}</code>
                       <Button 
                         size="xs" 
                         variant="primary" 
                         onClick={(e) => {
                           e.stopPropagation();
                           handleCopy(voucher.code);
                         }}
                       >
                         Copy
                       </Button>
                    </div>
                 </div>
              </AppCard>
            );
          })}
        </div>
      ) : (
        <div className="pt-8">
           <EmptyState 
             icon={<Search className="w-10 h-10 text-slate-300" />}
             title={t('voucher.noResults')}
             description="Try adjusting your filters or search term."
             action={<Button variant="outline" size="sm" onClick={() => {setSearchTerm(''); setActiveFilter('All');}}>{t('voucher.clearFilters')}</Button>}
           />
        </div>
      )}

      <Modal 
        isOpen={!!selectedVoucher} 
        onClose={() => setSelectedVoucher(null)}
        title={t('voucher.details')}
      >
        {selectedVoucher && (
           <div className="pb-safe">
             <div className="flex flex-col items-center mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-3 shadow-lg ${stores.find(s => s.id === selectedVoucher.storeId)?.color}`}>
                   {stores.find(s => s.id === selectedVoucher.storeId)?.initials}
                </div>
                <h2 className="text-xl font-bold text-slate-900 text-center">{selectedVoucher.title}</h2>
                <p className="text-slate-500 text-sm mt-1">{stores.find(s => s.id === selectedVoucher.storeId)?.name}</p>
             </div>

             <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100 text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Voucher Code</p>
                <div className="text-3xl font-mono font-bold text-slate-900 tracking-wider mb-4 border-2 border-dashed border-slate-200 py-2 rounded-xl bg-white">
                  {selectedVoucher.code}
                </div>
                <p className="text-xs text-red-500 font-medium flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
                  Expires in {selectedVoucher.expiry}
                </p>
             </div>

             <div className="space-y-4 mb-8">
               <h3 className="font-bold text-slate-900 text-sm">{t('voucher.terms')}</h3>
               <ul className="text-sm text-slate-500 space-y-2 list-disc pl-4">
                 <li>Valid only for online purchases at {stores.find(s => s.id === selectedVoucher.storeId)?.name}.</li>
                 <li>Minimum spend of $50 required to apply discount.</li>
                 <li>One use per customer.</li>
                 <li>Cannot be combined with other promotional codes.</li>
               </ul>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" onClick={() => handleCopy(selectedVoucher.code)}>
                   <Copy className="w-4 h-4 mr-2" /> {t('voucher.copyCode')}
                </Button>
                <Button className="shadow-xl shadow-primary-600/20">
                   {t('voucher.shopEarn')} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
             </div>
           </div>
        )}
      </Modal>
    </PageLayout>
  );
};
