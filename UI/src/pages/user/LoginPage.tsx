import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Toast } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/auth.service';
import { disableDemoMode, enableDemoMode } from '@/lib/auth';
import { routePaths } from '@/routes/routePaths';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleLogin = async () => {
    setLoading(true);
    try {
      await authService.login({ email, password });
      disableDemoMode();
      navigate(routePaths.user.home);
    } catch {
      setToast({ show: true, message: 'Login failed. Check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    enableDemoMode();
    navigate(routePaths.user.home);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      <div className="w-full max-w-sm bg-white border border-slate-100 rounded-3xl shadow-soft p-6">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">{t('login.title')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('login.subtitle')}</p>
        </div>

        <div className="space-y-4">
          <Input
            label={t('login.email')}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label={t('login.password')}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full" onClick={handleLogin} isLoading={loading}>
            {t('login.cta')}
          </Button>
          <Button className="w-full" variant="secondary" onClick={handleDemo}>
            {t('login.demo')}
          </Button>
        </div>
      </div>
    </div>
  );
};
