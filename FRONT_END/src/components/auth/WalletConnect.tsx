import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { WalletIcon, CheckCircle2Icon, AlertCircleIcon } from 'lucide-react';
import { useWeb3 } from '../../hooks/useWeb3';
import { Button } from '../common/Button';
import { truncateAddress } from '../../utils/helpers';
export function WalletConnect() {
  const { t } = useTranslation(['auth', 'common']);
  const {
    isConnected,
    address,
    isConnecting,
    connectWallet,
    disconnectWallet
  } = useWeb3();
  return (
    <div className="bg-[#111118]/90 rounded-2xl shadow-2xl shadow-red-500/5 border border-red-500/10 p-8 text-center max-w-md w-full mx-auto font-genos">
      <div className="mb-6 relative">
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto relative z-10">
          <WalletIcon className="w-12 h-12 text-red-500" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/10 rounded-full animate-pulse-slow" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        {isConnected ? t('auth:login.connected') : t('auth:login.notConnected')}
      </h2>

      <p className="text-gray-400 mb-8">
        {isConnected ?
        t('auth:login.walletConnectedDesc') :
        t('auth:login.walletNotConnectedDesc')}
      </p>

      {isConnected ?
      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="space-y-4">
        
          <div className="bg-green-500/10 rounded-xl p-4 flex items-center justify-between border border-green-500/20">
            <div className="flex items-center text-green-400">
              <CheckCircle2Icon className="w-5 h-5 mr-2" />
              <span className="font-medium">{truncateAddress(address!)}</span>
            </div>
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold">
              {t('common:active')}
            </span>
          </div>

          <Button variant="outline" fullWidth onClick={disconnectWallet}>
            {t('auth:login.disconnectWallet')}
          </Button>
        </motion.div> :

      <div className="space-y-4">
          <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={connectWallet}
          loading={isConnecting}
          className="relative overflow-hidden group">
          
            <span className="relative z-10">
              {t('auth:login.connectMetaMask')}
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          </Button>

          <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
            <AlertCircleIcon className="w-4 h-4 mr-1" />
            <span>{t('auth:login.ethereumMainnet')}</span>
          </div>
        </div>
      }
    </div>);

}