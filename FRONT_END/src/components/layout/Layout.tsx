import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../common/Loader';
import { AnimatedBackground } from '../common/AnimatedBackground';
export function Layout() {
  const { t } = useTranslation('common');
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', {
        state: {
          from: location.pathname
        }
      });
    }
  }, [isAuthenticated, isLoading, navigate, location]);
  if (isLoading) {
    return <Loader fullScreen text={t('loading')} />;
  }
  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0F] font-genos relative">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" richColors theme="dark" />
    </div>);

}