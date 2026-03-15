import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ClockIcon,
  UsersIcon,
  CheckCircleIcon,
  PlayCircleIcon } from
'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ElectionStatus } from '../../utils/constants';
import { formatTimeRemaining, formatDate } from '../../utils/helpers';
interface ElectionCardProps {
  election: {
    id: string;
    orgName: string;
    name: string;
    description: string;
    status: ElectionStatus;
    startDate: string;
    endDate: string;
    participantCount: number;
    totalEligible: number;
  };
}
export function ElectionCard({ election }: ElectionCardProps) {
  const { t, i18n } = useTranslation(['election', 'common']);
  const getStatusConfig = (status: ElectionStatus) => {
    switch (status) {
      case 'active':
        return {
          color: 'bg-green-500/20 text-green-400 border-green-500/30',
          icon: <PlayCircleIcon className="w-3 h-3 mr-1" />,
          label: t('election:statusActive'),
          buttonText: t('election:voteNow'),
          buttonVariant: 'primary' as const
        };
      case 'upcoming':
        return {
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: <ClockIcon className="w-3 h-3 mr-1" />,
          label: t('election:statusUpcoming'),
          buttonText: t('common:viewDetails'),
          buttonVariant: 'outline' as const
        };
      case 'ended':
        return {
          color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
          icon: <CheckCircleIcon className="w-3 h-3 mr-1" />,
          label: t('election:statusEnded'),
          buttonText: t('election:viewResults'),
          buttonVariant: 'secondary' as const
        };
    }
  };
  const config = getStatusConfig(election.status);
  const participationRate =
  Math.round(election.participantCount / election.totalEligible * 100) || 0;
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95
      }}
      animate={{
        opacity: 1,
        scale: 1
      }}
      whileHover={{
        y: -4
      }}
      transition={{
        duration: 0.2
      }}>
      
      <Card
        hover
        className="h-full flex flex-col font-genos border-t-4"
        style={{
          borderTopColor:
          election.status === 'active' ?
          '#10B981' :
          election.status === 'upcoming' ?
          '#3B82F6' :
          '#9CA3AF'
        }}>
        
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {election.orgName}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
            
            {config.icon}
            {config.label}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {election.name}
        </h3>
        <p className="text-sm text-gray-400 mb-6 line-clamp-2 flex-grow">
          {election.description}
        </p>

        <div className="bg-[#0A0A0F] rounded-lg p-3 mb-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-400">
              <ClockIcon className="w-4 h-4 mr-1.5 text-gray-500" />
              {election.status === 'upcoming' ?
              t('election:starts') + ':' :
              t('election:ends') + ':'}
            </div>
            <span className="font-medium text-gray-200">
              {election.status === 'upcoming' ?
              formatDate(election.startDate, i18n.language) :
              formatTimeRemaining(election.endDate, i18n.language)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-400">
              <UsersIcon className="w-4 h-4 mr-1.5 text-gray-500" />
              {t('election:turnout')}:
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-200 mr-2">
                {participationRate}%
              </span>
              <div className="w-16 h-2 bg-[#1A1A24] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${election.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}
                  style={{
                    width: `${participationRate}%`
                  }} />
                
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Link
            to={`/elections/${election.id}${election.status === 'ended' ? '/results' : '/vote'}`}>
            
            <Button variant={config.buttonVariant} fullWidth>
              {config.buttonText}
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>);

}