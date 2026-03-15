import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LinkIcon,
  TwitterIcon,
  GithubIcon,
  DiscIcon as DiscordIcon } from
'lucide-react';
import { APP_NAME } from '../../utils/constants';
export function Footer() {
  const { t } = useTranslation('common');
  return (
    <footer className="bg-[#0A0A0F] text-white font-genos border-t border-red-500/10 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-red-500 p-1.5 rounded-lg">
                <LinkIcon className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              {t('footer.footerDescription')}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors">
                
                <span className="sr-only">Twitter</span>
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors">
                
                <span className="sr-only">GitHub</span>
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors">
                
                <span className="sr-only">Discord</span>
                <DiscordIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              {t('footer.platform')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-white text-sm">
                  
                  {t('navigation.dashboard')}
                </Link>
              </li>
              <li>
                <Link
                  to="/organizations"
                  className="text-gray-400 hover:text-white text-sm">
                  
                  {t('navigation.organizations')}
                </Link>
              </li>
              <li>
                <Link
                  to="/elections"
                  className="text-gray-400 hover:text-white text-sm">
                  
                  {t('navigation.elections')}
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-400 hover:text-white text-sm">
                  
                  {t('navigation.profile')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              {t('footer.resources')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  {t('footer.documentation')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  {t('footer.smartContracts')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  {t('footer.apiReference')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  {t('footer.helpCenter')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  {t('footer.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  {t('footer.termsOfService')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  {t('footer.cookiePolicy')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-red-500/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} {APP_NAME}.{' '}
            {t('footer.allRightsReserved')}
          </p>
          <div className="mt-4 md:mt-0 flex items-center bg-[#1A1A24] rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            <span className="text-xs font-medium text-gray-300">
              {t('footer.ethereumMainnetActive')}
            </span>
          </div>
        </div>
      </div>
    </footer>);

}