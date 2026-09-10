import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ 
  children, 
  fallback = null 
}) => {
  const location = useLocation();
  const { userInfo } = useUserStore();
  const isAdmin = userInfo?.metadata?.role === 'admin';

  if (!isAdmin) {
    return fallback || <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export const useIsAdmin = (): boolean => {
  const { userInfo } = useUserStore();
  return userInfo?.metadata?.role === 'admin';
};