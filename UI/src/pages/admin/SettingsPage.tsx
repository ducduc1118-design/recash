import React, { useEffect, useState } from 'react';
import { AppCard, Button, Input, Switch, Toast } from '@/components/ui';
import { adminService } from '@/services/admin.service';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    minWithdrawal: '10',
    signUpBonus: '5',
    referralBonus: '10',
    cashbackHoldDays: '60',
    maintenanceMode: false,
    allowRegistrations: true,
  });
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await adminService.getSettings(controller.signal);
        if (data) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch {
        setToast({ show: true, message: 'Unable to load settings.' });
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const handleSave = async () => {
    try {
      await adminService.updateSettings(settings);
      setToast({ show: true, message: 'Settings saved.' });
    } catch {
      setToast({ show: true, message: 'Unable to save settings.' });
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
      
      <AppCard className="space-y-6">
         <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Global Config</h3>
         <div className="grid grid-cols-2 gap-4">
            <Input label="Min Withdrawal ($)" value={settings.minWithdrawal} type="number" onChange={(e) => setSettings({ ...settings, minWithdrawal: e.target.value })} />
            <Input label="Sign Up Bonus ($)" value={settings.signUpBonus} type="number" onChange={(e) => setSettings({ ...settings, signUpBonus: e.target.value })} />
         </div>
         <div className="grid grid-cols-2 gap-4">
            <Input label="Referral Bonus ($)" value={settings.referralBonus} type="number" onChange={(e) => setSettings({ ...settings, referralBonus: e.target.value })} />
            <Input label="Cashback Hold Days" value={settings.cashbackHoldDays} type="number" onChange={(e) => setSettings({ ...settings, cashbackHoldDays: e.target.value })} />
         </div>
      </AppCard>

      <AppCard className="space-y-6">
         <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Maintenance</h3>
         <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Maintenance Mode</p>
              <p className="text-xs text-slate-500">Disable app access for users</p>
            </div>
            <Switch checked={settings.maintenanceMode} onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })} />
         </div>
         <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Allow New Registrations</p>
              <p className="text-xs text-slate-500">Turn off to stop new signups</p>
            </div>
            <Switch checked={settings.allowRegistrations} onCheckedChange={(checked) => setSettings({ ...settings, allowRegistrations: checked })} />
         </div>
      </AppCard>
      
      <div className="flex justify-end">
         <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
};
