import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Settings, Trash2 } from 'lucide-react';
import { AppCard, Button, Input, Toast } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '@/routes/routePaths';
import { authService } from '@/services/auth.service';
import type { User } from '@/types/domain';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'payout'>('info');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [profile, setProfile] = useState<User | null>(null);
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.j@example.com');
  const [phone, setPhone] = useState('+1 (555) 000-1234');
  
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await authService.me(controller.signal);
        setProfile(data);
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
      } catch {
        setToast({ show: true, message: 'Unable to load profile.' });
      }
    };
    load();
    return () => controller.abort();
  }, []);
  
  const handleSave = () => {
    setLoading(true);
    authService
      .updateMe({ name, email, phone })
      .then((updated) => {
        setProfile(updated);
        setToast({ show: true, message: 'Profile updated.' });
      })
      .catch(() => setToast({ show: true, message: 'Unable to save profile.' }))
      .finally(() => setLoading(false));
  };

  return (
    <div className="pt-6 pb-20 min-h-screen bg-slate-50">
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      <div className="flex items-center mb-6 pt-2">
         <button onClick={() => navigate(routePaths.user.account)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
           <ArrowLeft className="w-5 h-5 text-slate-600" />
         </button>
         <h1 className="text-xl font-bold text-slate-900 ml-2">My Profile</h1>
       </div>

       <div className="flex space-x-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
         {['info', 'payout'].map((tab) => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab as 'info' | 'payout')}
             className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
               activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
             }`}
           >
             {tab === 'info' ? 'Personal Info' : 'Payout Methods'}
           </button>
         ))}
       </div>

       {activeTab === 'info' ? (
         <div className="space-y-4 animate-in fade-in">
           <AppCard className="space-y-4">
             <div className="flex justify-center mb-4">
               <div className="relative">
                  <img src={profile?.avatarUrl || 'https://picsum.photos/200'} className="w-24 h-24 rounded-full object-cover" />
                  <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-slate-100 text-primary-600">
                    <Settings className="w-4 h-4" />
                  </button>
               </div>
             </div>
             <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
             <Input label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
             <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
             <div className="pt-2">
               <Button className="w-full" onClick={handleSave} isLoading={loading}>Save Changes</Button>
             </div>
           </AppCard>
         </div>
       ) : (
         <div className="space-y-4 animate-in fade-in">
           <AppCard className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-primary-700 font-bold border border-slate-100">
                  CH
                </div>
                <div>
                  <p className="font-bold text-slate-900">Chase Bank</p>
                  <p className="text-xs text-slate-500">**** 4432 • Primary</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
           </AppCard>
           
           <AppCard className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                  P
                </div>
                <div>
                  <p className="font-bold text-slate-900">PayPal</p>
                  <p className="text-xs text-slate-500">alex.j@example.com</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
           </AppCard>

           <Button variant="outline" className="w-full border-dashed">
             <Plus className="w-4 h-4 mr-2" /> Add New Method
           </Button>
         </div>
       )}
    </div>
  );
};
