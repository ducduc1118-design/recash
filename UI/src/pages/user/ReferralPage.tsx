import React, { useEffect, useState } from 'react';
import { ArrowLeft, Copy, Gift, QrCode, Share2, Users } from 'lucide-react';
import { AppCard, Button, EmptyState, StatusBadge, Toast } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '@/routes/routePaths';
import { referralService } from '@/services/referral.service';
import type { Referral } from '@/types/domain';

export const ReferralPage: React.FC = () => {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await referralService.getReferrals(controller.signal);
        setReferrals(data);
      } catch {
        setToast({ show: true, message: 'Unable to load referrals.' });
      }
    };
    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="pt-6 pb-20 min-h-screen bg-slate-50">
       <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
       <div className="flex items-center mb-6 pt-2">
         <button onClick={() => navigate(routePaths.user.account)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
           <ArrowLeft className="w-5 h-5 text-slate-600" />
         </button>
         <h1 className="text-xl font-bold text-slate-900 ml-2">Refer Friends</h1>
       </div>

       <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white text-center mb-8 shadow-xl shadow-indigo-500/20">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">$50.00</h2>
          <p className="text-indigo-100 text-sm mb-6">Total Referral Earnings</p>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/20">
             <div className="text-left">
               <p className="text-xs text-indigo-200 uppercase font-bold">Your Code</p>
               <p className="text-xl font-mono font-bold tracking-widest">ALEX2024</p>
             </div>
             <button 
               className="p-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
               onClick={() => navigator.clipboard.writeText('ALEX2024')}
             >
               <Copy className="w-5 h-5" />
             </button>
          </div>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-8">
         <Button variant="secondary" className="bg-white border border-slate-100 shadow-sm h-auto py-4 flex-col gap-2">
           <QrCode className="w-6 h-6 text-slate-700" />
           <span>Show QR</span>
         </Button>
         <Button variant="secondary" className="bg-white border border-slate-100 shadow-sm h-auto py-4 flex-col gap-2">
           <Share2 className="w-6 h-6 text-slate-700" />
           <span>Share Link</span>
         </Button>
       </div>

       <h3 className="font-bold text-slate-900 mb-4">Invited Friends</h3>
       {referrals.length > 0 ? (
         <div className="space-y-3">
           {referrals.map(friend => (
             <AppCard key={friend.id} className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                    {friend.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{friend.name}</p>
                    <p className="text-xs text-slate-500">{friend.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 text-sm">{friend.earnings}</p>
                  <StatusBadge label={friend.status} variant={friend.status === 'Shopped' ? 'success' : 'neutral'} />
                </div>
             </AppCard>
           ))}
         </div>
       ) : (
         <EmptyState 
           icon={<Users className="w-10 h-10 text-slate-300" />}
           title="No invites yet"
           description="Share your code to start earning!"
         />
       )}
    </div>
  );
};
