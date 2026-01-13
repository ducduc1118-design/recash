import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AppCard, Button, Toast } from '@/components/ui';
import { adminService } from '@/services/admin.service';

const fallbackStores = [
  { name: 'Amazon', color: 'bg-orange-100 text-orange-600', cashback: '12%' },
  { name: 'Nike', color: 'bg-slate-100 text-slate-800', cashback: '8%' },
  { name: 'Adidas', color: 'bg-slate-900 text-white', cashback: '10%' },
  { name: 'Sephora', color: 'bg-pink-100 text-pink-600', cashback: '15%' },
];

export const StoresPage: React.FC = () => {
  const [stores, setStores] = useState(fallbackStores);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await adminService.getStores(controller.signal);
        if (Array.isArray(data)) {
          setStores(data);
        }
      } catch {
        setToast({ show: true, message: 'Unable to load stores.' });
      }
    };
    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-6">
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Stores</h2>
        <Button><Plus className="w-4 h-4 mr-2" /> Add Store</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stores.map((store: any, i: number) => (
          <AppCard key={i} className="flex flex-col items-center text-center p-6 group cursor-pointer hover:border-primary-200 transition-all">
             <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 ${store.color}`}>
                {store.name.substring(0, 2)}
             </div>
             <h3 className="font-bold text-slate-900 mb-1">{store.name}</h3>
             <p className="text-sm text-green-600 font-bold mb-4">Up to {store.cashback}</p>
             <div className="flex space-x-2 w-full">
               <Button size="xs" variant="secondary" className="flex-1">Edit</Button>
               <Button size="xs" variant="outline" className="flex-1">Disable</Button>
             </div>
          </AppCard>
        ))}
      </div>
    </div>
  );
};
