import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UsersIcon, VoteIcon, ShieldCheckIcon } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { truncateAddress } from '../../utils/helpers';
interface OrgCardProps {
  org: {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    activeElections: number;
    owner: string;
    joined: boolean;
  };
  onJoin?: (id: string) => void;
}
export function OrgCard({ org, onJoin }: OrgCardProps) {
  const { t } = useTranslation('common');
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
      
      <Card hover className="h-full flex flex-col font-genos">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
            {org.name.charAt(0)}
          </div>
          {org.joined &&
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
              <ShieldCheckIcon className="w-3 h-3 mr-1" />
              {t('member')}
            </span>
          }
        </div>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
          {org.name}
        </h3>
        <p className="text-sm text-gray-400 mb-6 line-clamp-2 flex-grow">
          {org.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
              {t('members')}
            </span>
            <div className="flex items-center text-gray-200 font-medium">
              <UsersIcon className="w-4 h-4 mr-1.5 text-gray-500" />
              {org.memberCount.toLocaleString()}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
              {t('activeVotes')}
            </span>
            <div className="flex items-center text-gray-200 font-medium">
              <VoteIcon className="w-4 h-4 mr-1.5 text-red-500" />
              {org.activeElections}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#1A1A24] mt-auto">
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-1">{t('owner')}:</span>
            <span className="font-mono bg-[#1A1A24] px-1.5 py-0.5 rounded">
              {truncateAddress(org.owner)}
            </span>
          </div>

          {org.joined ?
          <Link to={`/organizations/${org.id}`}>
              <Button variant="outline" size="sm">
                {t('viewDetails')}
              </Button>
            </Link> :

          <Button
            variant="primary"
            size="sm"
            onClick={() => onJoin && onJoin(org.id)}>
            
              {t('join')}
            </Button>
          }
        </div>
      </Card>
    </motion.div>);

}