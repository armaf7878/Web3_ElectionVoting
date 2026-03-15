import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LinkIcon, CheckCircle2Icon, UserIcon, MailIcon } from 'lucide-react';
import { WalletConnect } from '../components/auth/WalletConnect';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';
import { useWeb3 } from '../hooks/useWeb3';
import { APP_NAME } from '../utils/constants';
export function Register() {
  const { t } = useTranslation(['auth', 'common']);
  const { isConnected } = useWeb3();
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  useEffect(() => {
    if (isConnected && step === 1) {
      setTimeout(() => setStep(2), 1000);
    }
  }, [isConnected, step]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData);
    navigate('/dashboard');
  };
  const steps = [
  {
    id: 1,
    name: t('auth:register.connectWalletStep')
  },
  {
    id: 2,
    name: t('auth:register.profileDetailsStep')
  }];

  return (
    <div className="min-h-screen bg-[#0A0A0F] font-genos py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <Link to="/" className="flex items-center gap-2 mb-12 group">
        <div className="bg-red-500 p-1.5 rounded-lg group-hover:bg-red-600 transition-colors">
          <LinkIcon className="h-6 w-6 text-white" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-white">
          {APP_NAME}
        </span>
      </Link>

      <div className="w-full max-w-2xl">
        {/* Progress Stepper */}
        <nav aria-label="Progress" className="mb-12">
          <ol role="list" className="flex items-center">
            {steps.map((s, stepIdx) =>
            <li
              key={s.name}
              className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
              
                <div className="flex items-center">
                  <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full ${step > s.id ? 'bg-red-600 hover:bg-red-700' : step === s.id ? 'border-2 border-red-600 bg-[#111118]' : 'border-2 border-[#2A2A34] bg-[#111118]'}`}>
                  
                    {step > s.id ?
                  <CheckCircle2Icon
                    className="h-5 w-5 text-white"
                    aria-hidden="true" /> :


                  <span
                    className={`text-sm font-bold ${step === s.id ? 'text-red-500' : 'text-gray-500'}`}>
                    
                        {s.id}
                      </span>
                  }
                  </div>
                  <span
                  className={`ml-4 text-sm font-medium ${step >= s.id ? 'text-white' : 'text-gray-500'}`}>
                  
                    {s.name}
                  </span>
                </div>
                {stepIdx !== steps.length - 1 &&
              <div
                className="absolute top-4 left-0 -ml-px mt-0.5 h-0.5 w-full bg-[#2A2A34]"
                aria-hidden="true">
                
                    <div
                  className="h-full bg-red-600 transition-all duration-500 ease-in-out"
                  style={{
                    width: step > s.id ? '100%' : '0%'
                  }} />
                
                  </div>
              }
              </li>
            )}
          </ol>
        </nav>

        {/* Form Content */}
        <motion.div
          key={step}
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: -20
          }}
          transition={{
            duration: 0.3
          }}>
          
          {step === 1 ?
          <div className="flex flex-col items-center">
              <h2 className="text-3xl font-extrabold text-white mb-8 text-center">
                {t('auth:register.firstConnectWallet')}
              </h2>
              <WalletConnect />
              <p className="mt-6 text-center text-sm text-gray-400">
                {t('auth:register.alreadyHaveAccount')}{' '}
                <Link
                to="/login"
                className="font-medium text-red-400 hover:text-red-300">
                
                  {t('auth:register.logIn')}
                </Link>
              </p>
            </div> :

          <Card className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {t('auth:register.completeProfile')}
                </h2>
                <p className="text-gray-400 mt-1">
                  {t('auth:register.profileAssociation')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                label={t('auth:register.fullName')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Satoshi Nakamoto"
                required
                icon={<UserIcon className="w-5 h-5" />} />
              

                <Input
                label={t('auth:register.emailAddress')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                icon={<MailIcon className="w-5 h-5" />}
                helperText={t('auth:register.emailHelper')} />
              

                <div className="pt-4 border-t border-[#1A1A24] flex justify-between items-center">
                  <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}>
                  
                    {t('common:back')}
                  </Button>
                  <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isLoading}
                  disabled={!formData.name || !formData.email}>
                  
                    {t('auth:register.createAccount')}
                  </Button>
                </div>
              </form>
            </Card>
          }
        </motion.div>
      </div>
    </div>);

}