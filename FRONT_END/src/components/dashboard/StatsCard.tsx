import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { Card } from '../common/Card';
import { classNames } from '../../utils/helpers';
interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  delay?: number;
}
export function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  delay = 0
}: StatsCardProps) {
  const { t } = useTranslation('common');
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.4,
        delay
      }}>
      
      <Card hover className="h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
          </div>
          <div className="p-3 bg-red-500/20 rounded-xl text-red-500">
            {icon}
          </div>
        </div>

        {change &&
        <div className="mt-4 flex items-center text-sm">
            {changeType === 'positive' &&
          <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
          }
            {changeType === 'negative' &&
          <TrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
          }
            <span
            className={classNames(
              'font-medium',
              changeType === 'positive' ? 'text-green-600' : '',
              changeType === 'negative' ? 'text-red-600' : '',
              changeType === 'neutral' ? 'text-gray-500' : ''
            )}>
            
              {change}
            </span>
            <span className="text-gray-600 ml-1">{t('vsLastMonth')}</span>
          </div>
        }
      </Card>
    </motion.div>);

}