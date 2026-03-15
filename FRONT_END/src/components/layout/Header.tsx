import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  MenuIcon,
  XIcon,
  LinkIcon,
  ChevronDownIcon,
  LogOutIcon,
  UserIcon } from
'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWeb3 } from '../../hooks/useWeb3';
import { APP_NAME } from '../../utils/constants';
import { truncateAddress, classNames } from '../../utils/helpers';
import { Button } from '../common/Button';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
export function Header() {
  const { t } = useTranslation('common');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { isConnected, address, disconnectWallet } = useWeb3();
  const location = useLocation();
  const translatedNavLinks = [
  {
    label: t('navigation.dashboard'),
    path: '/dashboard'
  },
  {
    label: t('navigation.organizations'),
    path: '/organizations'
  },
  {
    label: t('navigation.elections'),
    path: '/elections'
  }];

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0F]/80 backdrop-blur-md border-b border-red-500/10 font-genos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-red-500 p-1.5 rounded-lg group-hover:bg-red-600 transition-colors">
                <LinkIcon className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                {APP_NAME}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated &&
          <nav className="hidden md:flex space-x-8">
              {translatedNavLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={classNames(
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                    isActive ?
                    'border-red-500 text-red-400' :
                    'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                  )}>
                  
                    {link.label}
                  </Link>);

            })}
            </nav>
          }

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {!isAuthenticated ?
            <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t('header.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    {t('header.register')}
                  </Button>
                </Link>
              </div> :

            <div className="flex items-center space-x-4">
                {/* Wallet Status */}
                <div className="flex items-center bg-[#1A1A24] rounded-full px-3 py-1.5 border border-red-500/10">
                  <div
                  className={classNames(
                    'w-2 h-2 rounded-full mr-2',
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  )} />
                
                  <span className="text-sm font-medium text-gray-300">
                    {isConnected ?
                  truncateAddress(address!) :
                  t('header.notConnected')}
                  </span>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                  onClick={() =>
                  setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-2 focus:outline-none">
                  
                    <img
                    className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                    src={user?.avatar}
                    alt={user?.name} />
                  
                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen &&
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    exit={{
                      opacity: 0,
                      y: 10
                    }}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-[#111118] ring-1 ring-red-500/10 divide-y divide-[#1A1A24] focus:outline-none">
                    
                        <div className="px-4 py-3">
                          <p className="text-sm text-white font-medium truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                        to="/profile"
                        className="group flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-white/5 hover:text-red-400"
                        onClick={() => setIsProfileDropdownOpen(false)}>
                        
                            <UserIcon className="mr-3 h-4 w-4 text-gray-400 group-hover:text-red-500" />
                            {t('header.yourProfile')}
                          </Link>
                        </div>
                        <div className="py-1">
                          <button
                        onClick={handleLogout}
                        className="group flex w-full items-center px-4 py-2 text-sm text-gray-200 hover:bg-white/5 hover:text-red-400">
                        
                            <LogOutIcon className="mr-3 h-4 w-4 text-gray-400 group-hover:text-red-500" />
                            {t('header.signOut')}
                          </button>
                        </div>
                      </motion.div>
                  }
                  </AnimatePresence>
                </div>
              </div>
            }
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500">
              
              <span className="sr-only">{t('header.openMainMenu')}</span>
              {isMobileMenuOpen ?
              <XIcon className="block h-6 w-6" aria-hidden="true" /> :

              <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          exit={{
            opacity: 0,
            height: 0
          }}
          className="md:hidden border-t border-[#1A1A24] bg-[#0A0A0F]">
          
            {isAuthenticated ?
          <>
                {/* Language Switcher in mobile */}
                <div className="px-4 pt-3">
                  <LanguageSwitcher />
                </div>
                <div className="pt-2 pb-3 space-y-1">
                  {translatedNavLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={classNames(
                      'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                      isActive ?
                      'bg-red-500/10 border-red-500 text-red-400' :
                      'border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}>
                    
                        {link.label}
                      </Link>);

              })}
                </div>
                <div className="pt-4 pb-3 border-t border-[#1A1A24]">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img
                    className="h-10 w-10 rounded-full"
                    src={user?.avatar}
                    alt="" />
                  
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">
                        {user?.name}
                      </div>
                      <div className="text-sm font-medium text-gray-400">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  
                      {t('header.yourProfile')}
                    </Link>
                    <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-400 hover:text-gray-200 hover:bg-white/5">
                  
                      {t('header.signOut')}
                    </button>
                  </div>
                </div>
              </> :

          <div className="pt-4 pb-4 px-4 space-y-3">
                {/* Language Switcher in mobile */}
                <div className="mb-2">
                  <LanguageSwitcher />
                </div>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth>
                    {t('header.login')}
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth>
                    {t('header.register')}
                  </Button>
                </Link>
              </div>
          }
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}