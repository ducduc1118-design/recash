import React, { useState } from 'react';
import { AlertCircle, Copy, Link as LinkIcon, Share2, ShoppingBag } from 'lucide-react';
import { AppCard, Button, Input, Toast } from '@/components/ui';
import { clicksService } from '@/services/clicks.service';
import type { Store } from '@/types/domain';
import { useTranslation } from 'react-i18next';

export const PasteLinkPage: React.FC = () => {
  const { t } = useTranslation();
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<{store: Store, cashback: number} | null>(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleSubmit = async () => {
    if (!link) return;
    setStatus('loading');

    try {
      const response = await clicksService.createLink({ url: link });
      setResult({ store: response.store, cashback: response.cashback });
      setStatus('success');
    } catch {
      setToast({ show: true, message: 'Unable to create link. Please try again.' });
      setStatus('error');
    }
  };

  const reset = () => {
    setLink('');
    setStatus('idle');
    setResult(null);
  };

  return (
    <div className="pt-24 pb-24 min-h-screen">
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      <div className="w-full">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
          <div className="w-full max-w-xl mx-auto">
            {status === 'idle' || status === 'loading' ? (
              <div className="w-full text-center">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6 mx-auto animate-bounce-slow">
                  <LinkIcon className="w-10 h-10 text-primary-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('pasteLink.title')}</h1>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                  {t('pasteLink.subtitle')}
                </p>

                <div className="w-full relative mb-4">
                  <Input 
                    placeholder={t('pasteLink.placeholder')} 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="h-14 text-center text-lg"
                    disabled={status === 'loading'}
                  />
                </div>

                <Button 
                  size="lg" 
                  className="w-full shadow-xl shadow-primary-500/20" 
                  onClick={handleSubmit}
                  isLoading={status === 'loading'}
                  disabled={!link}
                >
                  {t('pasteLink.generate')}
                </Button>
                
                <p className="mt-8 text-xs text-slate-400">
                   Try links from: Amazon, Nike, Sephora, eBay...
                </p>
              </div>
            ) : status === 'success' && result ? (
              <div className="w-full animate-in zoom-in-95 duration-300">
                 <AppCard className="text-center p-6 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
                   <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-xl font-bold mb-4 ${result.store.color}`}>
                     {result.store.initials}
                   </div>
                   <h2 className="text-xl font-bold text-slate-900">{t('pasteLink.successTitle')}</h2>
                   <p className="text-slate-500 mb-6">
                     Shop at <span className="font-bold text-slate-800">{result.store.name}</span> and earn up to <span className="text-green-600 font-bold">{result.store.cashbackUpTo}%</span> cashback.
                   </p>

                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-left flex items-center space-x-3">
                     <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-6 h-6 text-slate-300" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-xs text-slate-500 uppercase font-bold">Product Link</p>
                       <p className="text-sm font-medium text-slate-900 truncate">{link}</p>
                     </div>
                   </div>
                   
                   <div className="space-y-3">
                     <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 shadow-green-500/20">
                       {t('pasteLink.shopNow')}
                     </Button>
                     <div className="grid grid-cols-2 gap-3">
                       <Button variant="secondary" onClick={() => navigator.clipboard.writeText(link)}>
                         <Copy className="w-4 h-4 mr-2" /> {t('pasteLink.copy')}
                       </Button>
                       <Button variant="secondary">
                         <Share2 className="w-4 h-4 mr-2" /> {t('pasteLink.share')}
                       </Button>
                     </div>
                   </div>
                   
                   <button onClick={reset} className="mt-6 text-sm text-slate-400 hover:text-slate-600 underline">
                     Generate another link
                   </button>
                 </AppCard>
              </div>
            ) : (
              <div className="w-full text-center animate-in shake">
                 <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                   <AlertCircle className="w-10 h-10 text-red-500" />
                 </div>
                 <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid or Unsupported Link</h2>
                 <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                   We couldn't identify a supported store from this link. Please try copying the product link again.
                 </p>
                 <Button size="lg" variant="secondary" className="w-full" onClick={reset}>
                   {t('pasteLink.tryAgain')}
                 </Button>
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <AppCard className="p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3">{t('pasteLink.tips')}</h3>
              <div className="space-y-3 text-sm text-slate-500">
                <p>Use the product page URL, not search results.</p>
                <p>Make sure the store name appears in the link.</p>
                <p>After generating, complete purchase in the same session.</p>
              </div>
            </AppCard>
          </div>
        </div>
      </div>
    </div>
  );
};
