import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { StatusBadge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Toast } from '@/components/ui';
import { adminService } from '@/services/admin.service';
import type { WithdrawalRequest } from '@/types/domain';

export const WithdrawalsPage: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await adminService.getWithdrawals(controller.signal);
        setWithdrawals(data);
      } catch {
        setToast({ show: true, message: 'Unable to load withdrawals.' });
      }
    };
    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-6">
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Withdrawals</h2>
      </div>
      
      <Table>
        <TableHeader>
          <TableHead>User</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableHeader>
        <TableBody>
          {withdrawals.map(w => (
             <TableRow key={w.id}>
               <TableCell className="font-bold text-slate-900">{w.user}</TableCell>
               <TableCell>{w.method}</TableCell>
               <TableCell><span className="font-mono text-xs text-slate-500">{w.details}</span></TableCell>
               <TableCell className="font-bold">{w.amount}</TableCell>
               <TableCell>{w.date}</TableCell>
               <TableCell><StatusBadge label={w.status} variant={w.status === 'Approved' ? 'success' : w.status === 'Rejected' ? 'error' : 'warning'} /></TableCell>
               <TableCell>
                 {w.status === 'Pending' && (
                   <div className="flex space-x-2">
                      <button
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        onClick={async () => {
                          try {
                            await adminService.updateWithdrawalStatus(w.id, 'Approved');
                            setWithdrawals((prev) => prev.map((item) => (item.id === w.id ? { ...item, status: 'Approved' } : item)));
                          } catch {
                            setToast({ show: true, message: 'Unable to update withdrawal.' });
                          }
                        }}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        onClick={async () => {
                          try {
                            await adminService.updateWithdrawalStatus(w.id, 'Rejected');
                            setWithdrawals((prev) => prev.map((item) => (item.id === w.id ? { ...item, status: 'Rejected' } : item)));
                          } catch {
                            setToast({ show: true, message: 'Unable to update withdrawal.' });
                          }
                        }}
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                   </div>
                 )}
               </TableCell>
             </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
