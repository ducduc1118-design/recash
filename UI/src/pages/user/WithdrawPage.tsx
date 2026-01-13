import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronDown, Landmark, Smartphone } from 'lucide-react';
import { Button, Modal, Toast } from '@/components/ui';
import { withdrawalsService } from '@/services/withdrawals.service';
import { routePaths } from '@/routes/routePaths';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const WithdrawPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [method, setMethod] = useState<'bank' | 'ewallet'>('bank');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [withdrawals, setWithdrawals] = useState([]);
  
  const handleWithdraw = () => setStep('confirm');
  const confirmWithdraw = async () => {
    try {
      await withdrawalsService.createWithdrawal({ amount: Number(amount), method });
      setTimeout(() => setStep('success'), 1000);
    } catch {
      setToast({ show: true, message: 'Unable to submit withdrawal.' });
      setStep('input');
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await withdrawalsService.getWithdrawals(controller.signal);
        setWithdrawals(data);
      } catch {
        setToast({ show: true, message: 'Unable to load withdrawals.' });
      }
    };
    load();
    return () => controller.abort();
  }, []);

  if (step === 'success') {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center text-center">
         <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
         </div>
         <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('withdraw.submitted')}</h2>
         <p className="text-slate-500 mb-8">
           Your withdrawal of <span className="font-bold text-slate-900">${amount}</span> is being processed. It usually takes 1-3 business days.
         </p>
         <Button size="lg" className="w-full max-w-md" onClick={() => navigate(routePaths.user.wallet)}>
           {t('withdraw.backToWallet')}
         </Button>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-20 min-h-screen bg-slate-50">
       <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
       <div className="flex items-center mb-6 pt-2">
         <button onClick={() => navigate(routePaths.user.wallet)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
           <ArrowLeft className="w-5 h-5 text-slate-600" />
         </button>
         <h1 className="text-xl font-bold text-slate-900 ml-2">{t('withdraw.title')}</h1>
       </div>

       <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex mb-8">
          <button 
            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${method === 'bank' ? 'bg-primary-50 text-primary-700' : 'text-slate-500'}`}
            onClick={() => setMethod('bank')}
          >
            <Landmark className="w-4 h-4" /> Bank Transfer
          </button>
          <button 
            className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${method === 'ewallet' ? 'bg-primary-50 text-primary-700' : 'text-slate-500'}`}
            onClick={() => setMethod('ewallet')}
          >
            <Smartphone className="w-4 h-4" /> E-Wallet
          </button>
       </div>

       <div className="mb-8">
         <h3 className="font-bold text-slate-900 mb-4">{t('withdraw.destination')}</h3>
         {method === 'bank' ? (
           <div className="p-4 border border-primary-200 bg-primary-50/50 rounded-2xl flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary-700 font-bold border border-primary-100">
                  CH
                </div>
                <div>
                  <p className="font-bold text-slate-900">Chase Bank</p>
                  <p className="text-xs text-slate-500">**** 4432 • Alex Johnson</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
           </div>
         ) : (
           <div className="p-4 border border-primary-200 bg-primary-50/50 rounded-2xl flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-500 font-bold border border-primary-100">
                   P
                </div>
                <div>
                  <p className="font-bold text-slate-900">PayPal</p>
                  <p className="text-xs text-slate-500">alex.j@example.com</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
           </div>
         )}
       </div>

       <div className="mb-8">
         <h3 className="font-bold text-slate-900 mb-4">{t('withdraw.amount')}</h3>
         <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-16 pl-10 pr-4 text-2xl font-bold rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            />
         </div>
         <div className="flex gap-2">
            {[10, 50, 100].map(val => (
               <button 
                 key={val} 
                 onClick={() => setAmount(val.toString())}
                 className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium hover:border-primary-500 hover:text-primary-600 transition-colors"
               >
                 ${val}
               </button>
            ))}
            <button 
                 onClick={() => setAmount('1240.50')}
                 className="px-4 py-2 rounded-lg bg-primary-50 border border-primary-100 text-primary-700 text-sm font-bold transition-colors"
               >
                 Max
            </button>
         </div>
         <p className="text-xs text-slate-400 mt-2">Available balance: $1,240.50</p>
       </div>

       <Button 
         size="lg" 
         className="w-full shadow-xl shadow-primary-500/20" 
         disabled={!amount || Number(amount) <= 0}
         onClick={handleWithdraw}
       >
         {t('withdraw.review')}
       </Button>

       <Modal isOpen={step === 'confirm'} onClose={() => setStep('input')} title="Confirm Withdrawal">
          <div className="pb-safe">
             <div className="bg-slate-50 p-6 rounded-2xl mb-6 text-center">
                <p className="text-sm text-slate-500 mb-1">You are withdrawing</p>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">${amount}</h2>
                <div className="flex justify-between text-sm border-t border-slate-200 pt-3">
                   <span className="text-slate-500">Fee</span>
                   <span className="font-bold text-slate-900">$0.00</span>
                </div>
             </div>
             
             <div className="space-y-3 mb-6">
               <div className="flex justify-between text-sm">
                  <span className="text-slate-500">To</span>
                  <span className="font-medium text-slate-900">{method === 'bank' ? 'Chase Bank **** 4432' : 'PayPal'}</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Est. Arrival</span>
                  <span className="font-medium text-slate-900">Nov 5, 2023</span>
               </div>
             </div>

             <Button className="w-full" size="lg" onClick={confirmWithdraw}>
                {t('withdraw.confirm')}
             </Button>
          </div>
       </Modal>
    </div>
  );
};
