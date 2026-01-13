import React, { useEffect, useState } from 'react';
import { DollarSign, Tag, TrendingUp, Users, Wallet } from 'lucide-react';
import { AppCard, Button, StatusBadge, Toast } from '@/components/ui';
import { adminService } from '@/services/admin.service';
import type { WithdrawalRequest } from '@/types/domain';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 12405,
    totalRevenue: '$45,200',
    pendingCashout: '$3,240',
    activeOffers: 845,
  });
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const [dashboardData, withdrawalData] = await Promise.all([
          adminService.getDashboard(controller.signal),
          adminService.getWithdrawals(controller.signal),
        ]);
        setStats(dashboardData);
        setWithdrawals(withdrawalData);
      } catch {
        setToast({ show: true, message: 'Unable to load dashboard data.' });
      }
    };
    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-6">
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Revenue', value: stats.totalRevenue, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pending Cashout', value: stats.pendingCashout, icon: Wallet, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Active Offers', value: stats.activeOffers, icon: Tag, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat) => (
          <AppCard key={stat.label} className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </AppCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AppCard className="lg:col-span-2 min-h-[300px] flex flex-col justify-center items-center text-slate-400">
          <TrendingUp className="w-12 h-12 mb-2 opacity-20" />
          <p>Revenue Chart Placeholder</p>
        </AppCard>

        <AppCard className="space-y-4">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Recent Withdrawals</h3>
          {withdrawals.slice(0, 4).map(w => (
            <div key={w.id} className="flex justify-between items-center">
              <div>
                <p className="font-bold text-sm text-slate-900">{w.user}</p>
                <p className="text-xs text-slate-500">{w.amount} • {w.method}</p>
              </div>
              <StatusBadge label={w.status} variant={w.status === 'Approved' ? 'success' : 'warning'} />
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full text-xs">View All</Button>
        </AppCard>
      </div>
    </div>
  );
};
