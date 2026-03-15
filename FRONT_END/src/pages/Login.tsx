import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LinkIcon, ArrowLeftIcon } from 'lucide-react';
import { WalletConnect } from '../components/auth/WalletConnect';
import { useAuth } from '../hooks/useAuth';
import { useWeb3 } from '../hooks/useWeb3';
import { APP_NAME } from '../utils/constants';
export function Login() {
  const { t } = useTranslation(['auth', 'common']);
  const { isConnected, address, privateKey } = useWeb3();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || '/dashboard';
  useEffect(() => {
    if (isConnected && address && privateKey && !isLoading) {
      const performLogin = async () => {
        try {
          await login(address, privateKey);
          navigate(from, { replace: true });
        } catch (error) {
          console.error("Login component error:", error);
        }
      };
      performLogin();
    }
  }, [isConnected, address, privateKey, login, navigate, from, isLoading]);
  return (
    <div className="min-h-screen bg-[#0A0A0F] font-genos flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 mb-8 group">
          
          <div className="bg-red-500 p-2 rounded-xl shadow-lg group-hover:bg-red-600 transition-colors">
            <LinkIcon className="h-8 w-8 text-white" />
          </div>
          <span className="font-bold text-4xl tracking-tight text-white">
            {APP_NAME}
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {t('auth:login.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          {t('auth:login.orCreateAccount')}{' '}
          <Link
            to="/register"
            className="font-medium text-red-400 hover:text-red-300 transition-colors">
            
            {t('auth:login.createNewAccount')}
          </Link>
        </p>
      </div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.4
        }}>
        
        <WalletConnect />

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors">
            
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            {t('common:backToHome')}
          </Link>
        </div>
      </motion.div>
    </div>);

}