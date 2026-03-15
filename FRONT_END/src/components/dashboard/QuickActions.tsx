import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PlusIcon, UsersIcon, VoteIcon, ArrowRightIcon } from 'lucide-react';
import { Card } from '../common/Card';
export function QuickActions() {
  const { t } = useTranslation(['dashboard', 'common']);
  const actions = [
  {
    title: t('dashboard:createElection'),
    description: t('dashboard:createElectionDesc'),
    icon: <VoteIcon className="w-6 h-6 text-red-500" />,
    to: '/elections/create',
    color: 'bg-red-500/20'
  },
  {
    title: t('dashboard:createOrganization'),
    description: t('dashboard:createOrganizationDesc'),
    icon: <PlusIcon className="w-6 h-6 text-blue-500" />,
    to: '/organizations/create',
    color: 'bg-blue-500/20'
  },
  {
    title: t('dashboard:joinOrganization'),
    description: t('dashboard:joinOrganizationDesc'),
    icon: <UsersIcon className="w-6 h-6 text-green-500" />,
    to: '/organizations',
    color: 'bg-green-500/20'
  }];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-genos">
      {actions.map((action, index) =>
      <Link key={action.to} to={action.to} className="block group">
          <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            delay: index * 0.1
          }}
          whileHover={{
            y: -4
          }}>
          
            <Card className="h-full border border-red-500/10 hover:border-red-500/30 transition-colors">
              <div className="flex flex-col items-center text-center p-2">
                <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${action.color}`}>
                
                  {action.icon}
                </div>
                <h4 className="font-bold text-white mb-1">{action.title}</h4>
                <p className="text-xs text-gray-500 mb-3">
                  {action.description}
                </p>
                <div className="mt-auto flex items-center text-sm font-medium text-red-400 group-hover:text-red-500">
                  <span>{t('common:getStarted')}</span>
                  <ArrowRightIcon className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </motion.div>
        </Link>
      )}
    </div>);

}