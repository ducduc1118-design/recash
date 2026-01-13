import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button, AppCard, EmptyState, SkeletonList, StatusBadge, Modal, Toast } from '@/components/ui';
import type { Order, OrderStatus } from '@/types/domain';
import { ordersService } from '@/services/orders.service';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '@/routes/routePaths';
import { useTranslation } from 'react-i18next';

const OrderDetail: React.FC<{ order: Order }> = ({ order }) => {
  const { t } = useTranslation();
  return (
  <div>
    <div className="flex justify-between items-center mb-6">
       <div>
         <p className="text-xs text-slate-500">Order ID</p>
         <p className="font-mono font-bold text-slate-900">{order.orderNumber}</p>
       </div>
       <div className="text-right">
         <p className="text-xs text-slate-500">Est. Cashback</p>
         <p className="font-bold text-xl text-green-600">{order.cashback}</p>
       </div>
    </div>

    <h3 className="font-bold text-slate-900 text-sm mb-4">Tracking Timeline</h3>
    <div className="relative pl-4 border-l-2 border-slate-100 space-y-8 mb-8 ml-2">
       {order.timeline.map((item, idx) => (
         <div key={idx} className="relative">
            <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
              item.completed ? 'bg-green-500' : 'bg-slate-200'
            }`} />
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm font-bold ${item.completed ? 'text-slate-900' : 'text-slate-400'}`}>{item.status}</p>
              </div>
              <p className="text-xs text-slate-400">{item.date}</p>
            </div>
         </div>
       ))}
    </div>
    
    <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-700 flex items-start space-x-2 mb-6">
       <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
       <p>If your order is rejected or amount is incorrect, please contact support within 7 days.</p>
    </div>

    <Button className="w-full" variant="outline">
       {t('orders.report')}
    </Button>
  </div>
  );
};

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<OrderStatus>('Pending');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });

  const tabs: OrderStatus[] = ['Pending', 'Reviewing', 'Available', 'Rejected'];
  const displayOrders = orders.filter(o => o.status === activeTab);

  useEffect(() => {
    setSelectedOrder(null);
  }, [activeTab]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      try {
        const orderData = await ordersService.getOrders({ status: activeTab }, controller.signal);
        setOrders(orderData);
      } catch {
        setToast({ show: true, message: 'Unable to load orders.' });
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [activeTab]);

  return (
    <div className="pt-6 pb-20 min-h-screen bg-slate-50">
       <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
       <div className="flex items-center mb-6 pt-2">
         <button onClick={() => navigate(routePaths.user.wallet)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
           <ArrowLeft className="w-5 h-5 text-slate-600" />
         </button>
         <h1 className="text-xl font-bold text-slate-900 ml-2">{t('orders.title')}</h1>
       </div>

       <div className="flex space-x-1 mb-6 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
         {tabs.map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`flex-1 min-w-[80px] py-2 rounded-lg text-xs font-bold transition-all ${
               activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
             }`}
           >
             {tab}
           </button>
         ))}
       </div>

       <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
         <div>
           {loading ? (
             <SkeletonList count={4} />
           ) : displayOrders.length > 0 ? (
             <div className="space-y-4">
               {displayOrders.map(order => (
                 <AppCard
                   key={order.id}
                   className="cursor-pointer hover:border-primary-200 transition-colors"
                   onClick={async () => {
                     setSelectedOrder(order);
                     try {
                       const detail = await ordersService.getOrder(order.id);
                       setSelectedOrder(detail);
                     } catch {
                       setToast({ show: true, message: 'Unable to load order details.' });
                     }
                   }}
                 >
                    <div className="flex justify-between items-start mb-3">
                       <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-700">
                           {order.storeName.substring(0, 2).toUpperCase()}
                         </div>
                         <div>
                           <h3 className="font-bold text-slate-900 text-sm">{order.storeName}</h3>
                           <p className="text-xs text-slate-500">{order.date}</p>
                         </div>
                       </div>
                       <StatusBadge 
                         label={order.status} 
                         variant={order.status === 'Available' ? 'success' : order.status === 'Rejected' ? 'error' : 'warning'} 
                       />
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                       <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Order Amount</p>
                          <p className="text-sm font-semibold text-slate-700">{order.amount}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Cashback</p>
                          <p className="text-lg font-bold text-green-600">{order.cashback}</p>
                       </div>
                    </div>
                 </AppCard>
               ))}
             </div>
           ) : (
             <EmptyState 
               icon={<ShoppingBag className="w-10 h-10 text-slate-300" />}
               title={`${t('orders.noOrders')} (${activeTab})`}
               description="Orders will appear here once they are tracked."
             />
           )}
         </div>

         <div className="hidden lg:block">
           {selectedOrder ? (
             <AppCard className="p-6 sticky top-24">
               <OrderDetail order={selectedOrder} />
             </AppCard>
           ) : (
             <AppCard className="p-6 text-sm text-slate-500 sticky top-24">
               {t('orders.selectOrder')}
             </AppCard>
           )}
         </div>
       </div>

       <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={t('orders.details')} className="lg:hidden">
          {selectedOrder && (
            <div className="pb-safe">
              <OrderDetail order={selectedOrder} />
            </div>
          )}
       </Modal>
    </div>
  );
};
