import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Flame, ShoppingBag, Users } from 'lucide-react';
import { AppCard, Button, Toast } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '@/routes/routePaths';
import { MOCK_CHECKINS } from '@/mocks/data';
import { checkinService } from '@/services/checkin.service';

export const CheckinPage: React.FC = () => {
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await checkinService.getStatus(controller.signal);
        setStreak(data.streak);
      } catch {
        setToast({ show: true, message: 'Unable to load check-in status.' });
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
         <h1 className="text-xl font-bold text-slate-900 ml-2">Daily Rewards</h1>
       </div>

       <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold mb-4">
             <Flame className="w-3 h-3" fill="currentColor" />
             <span>{streak} Day Streak</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-2">1,250</h2>
          <p className="text-slate-400 text-sm mb-6">Total Points</p>
          
          <div className="flex justify-between max-w-sm mx-auto mb-8">
             {[1,2,3,4,5,6,7].map(day => (
               <div key={day} className="flex flex-col items-center gap-2">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                   day <= 5 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-100 text-slate-400'
                 }`}>
                   {day <= 5 ? <Check className="w-4 h-4" /> : day}
                 </div>
                 <span className="text-[10px] text-slate-400">Day {day}</span>
               </div>
             ))}
          </div>

          <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600 shadow-orange-500/20">
             Check In Today (+10 Pts)
          </Button>
       </div>

       <h3 className="font-bold text-slate-900 mb-4">Missions</h3>
       <div className="space-y-3 mb-8">
          <AppCard className="flex items-center justify-between p-4">
             <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                   <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                   <p className="font-bold text-slate-900 text-sm">Shop at Nike</p>
                   <p className="text-xs text-slate-500">Make a purchase {'>'} $50</p>
                </div>
             </div>
             <Button size="xs" variant="secondary">Go</Button>
          </AppCard>
          <AppCard className="flex items-center justify-between p-4">
             <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                   <Users className="w-5 h-5" />
                </div>
                <div>
                   <p className="font-bold text-slate-900 text-sm">Refer a Friend</p>
                   <p className="text-xs text-slate-500">Earn 100 pts per invite</p>
                </div>
             </div>
             <Button size="xs" variant="secondary">Invite</Button>
          </AppCard>
       </div>

       <h3 className="font-bold text-slate-900 mb-4">History</h3>
       <div className="space-y-3">
          {MOCK_CHECKINS.map(p => (
            <div key={p.id} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl">
               <div>
                  <p className="font-bold text-slate-900 text-sm">{p.activity}</p>
                  <p className="text-xs text-slate-500">{p.date}</p>
               </div>
               <span className="text-green-600 font-bold text-sm">+{p.points}</span>
            </div>
          ))}
       </div>
    </div>
  );
};
