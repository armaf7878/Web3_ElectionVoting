import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2Icon } from 'lucide-react';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <Loader2Icon className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but has no name, force them to complete profile
  // Allow them to navigate to complete-profile, but prevent other routes
  if (user && !user.name?.trim()) {
     if (location.pathname !== '/complete-profile') {
         return <Navigate to="/complete-profile" replace />;
     }
  }

  return <Outlet />;
}
