import React from 'react';
import { Navigate } from 'react-router-dom';
import { MOCK_USER } from '@/mocks/data';
import { getAuthToken, getStoredUser, isDemoMode } from '@/lib/auth';
import type { User } from '@/types/domain';
import { routePaths } from './routePaths';

const useMockAuth = () => {
  const token = getAuthToken();
  const storedUser = getStoredUser<User>();
  if (token && storedUser) {
    return { isAuthenticated: true, user: storedUser };
  }
  if (isDemoMode()) {
    return { isAuthenticated: true, user: MOCK_USER };
  }
  return { isAuthenticated: false, user: MOCK_USER };
};

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useMockAuth();
  if (!isAuthenticated) {
    return <Navigate to={routePaths.user.login} replace />;
  }
  return <>{children}</>;
};

export const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useMockAuth();
  if (!isAuthenticated || user.role !== 'admin') {
    return <Navigate to={routePaths.user.login} replace />;
  }
  return <>{children}</>;
};
