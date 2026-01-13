import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, StatusBadge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Toast } from '@/components/ui';
import { adminService } from '@/services/admin.service';

const fallbackOffers = [
  { title: '20% Off Footwear', category: 'Fashion', store: 'Nike', code: 'NIKE2024', expiry: 'Oct 30, 2023', status: 'Active' },
  { title: 'Free Shipping', category: 'Tech', store: 'BestBuy', code: 'FREESHIP', expiry: 'Nov 15, 2023', status: 'Draft' },
];

export const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState(fallbackOffers);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await adminService.getOffers(controller.signal);
        if (Array.isArray(data)) {
          setOffers(data);
        }
      } catch {
        setToast({ show: true, message: 'Unable to load offers.' });
      }
    };
    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-6">
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Offers</h2>
        <Button><Plus className="w-4 h-4 mr-2" /> Create Offer</Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableHead>Title</TableHead>
          <TableHead>Store</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Expiry</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableHeader>
        <TableBody>
          {offers.map((offer: any, idx: number) => (
            <TableRow key={`${offer.code}-${idx}`}>
               <TableCell>
                 <p className="font-bold text-slate-900">{offer.title}</p>
                 <p className="text-xs text-slate-500">{offer.category}</p>
               </TableCell>
               <TableCell>{offer.store}</TableCell>
               <TableCell><code className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{offer.code}</code></TableCell>
               <TableCell>{offer.expiry}</TableCell>
               <TableCell><StatusBadge label={offer.status} variant={offer.status === 'Active' ? 'success' : 'neutral'} /></TableCell>
               <TableCell><button className="text-primary-600 font-medium text-sm">Edit</button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
