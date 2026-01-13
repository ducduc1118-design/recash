import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, StatusBadge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TextArea, Toast } from '@/components/ui';
import type { Order } from '@/types/domain';
import { adminService } from '@/services/admin.service';

export const AdminOrdersPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [status, setStatus] = useState('Pending');
  const [note, setNote] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await adminService.getOrders(controller.signal);
        setOrders(data);
      } catch {
        setToast({ show: true, message: 'Unable to load orders.' });
      }
    };
    load();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setStatus(selectedOrder.status);
      setNote('');
    }
  }, [selectedOrder]);

  return (
    <div className="space-y-6">
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Orders</h2>
        <div className="flex space-x-2">
           <Button variant="outline" size="sm">Export CSV</Button>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableHead>Order ID</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Store</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Cashback</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableHeader>
        <TableBody>
          {orders.map(order => (
             <TableRow key={order.id}>
               <TableCell><span className="font-mono text-xs">{order.orderNumber}</span></TableCell>
               <TableCell>{order.user}</TableCell>
               <TableCell>{order.storeName}</TableCell>
               <TableCell>{order.amount}</TableCell>
               <TableCell className="font-bold text-green-600">{order.cashback}</TableCell>
               <TableCell><StatusBadge label={order.status} variant={order.status === 'Available' ? 'success' : order.status === 'Rejected' ? 'error' : 'warning'} /></TableCell>
               <TableCell>
                 <button className="text-primary-600 font-medium text-sm" onClick={() => setSelectedOrder(order)}>Update</button>
               </TableCell>
             </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Update Order Status">
         <div className="space-y-4 pb-safe">
            <p className="text-sm text-slate-500">Change status for order <span className="font-bold text-slate-900">{selectedOrder?.orderNumber}</span></p>
            <Select 
              label="Status" 
              options={[
                { label: 'Pending', value: 'Pending' },
                { label: 'Reviewing', value: 'Reviewing' },
                { label: 'Available', value: 'Available' },
                { label: 'Rejected', value: 'Rejected' },
              ]} 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
            <TextArea
              label="Admin Note (Optional)"
              placeholder="Reason for rejection or internal note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={async () => {
                if (!selectedOrder) return;
                try {
                  await adminService.updateOrderStatus(selectedOrder.id, status, note);
                  setToast({ show: true, message: 'Order updated.' });
                  setSelectedOrder(null);
                } catch {
                  setToast({ show: true, message: 'Unable to update order.' });
                }
              }}
            >
              Save Changes
            </Button>
         </div>
      </Modal>
    </div>
  );
};
