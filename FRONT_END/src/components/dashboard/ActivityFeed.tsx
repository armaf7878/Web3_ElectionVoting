import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { VoteIcon, UsersIcon, PlusCircleIcon } from 'lucide-react';
import { MOCK_ACTIVITIES } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
export function ActivityFeed() {
  const { i18n } = useTranslation();
  const getIcon = (type: string) => {
    switch (type) {
      case 'vote':
        return <VoteIcon className="w-5 h-5 text-blue-500" />;
      case 'join':
        return <UsersIcon className="w-5 h-5 text-green-500" />;
      case 'create':
        return <PlusCircleIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <VoteIcon className="w-5 h-5 text-gray-500" />;
    }
  };
  const getBgColor = (type: string) => {
    switch (type) {
      case 'vote':
        return 'bg-blue-500/20';
      case 'join':
        return 'bg-green-500/20';
      case 'create':
        return 'bg-purple-500/20';
      default:
        return 'bg-gray-500/20';
    }
  };
  return (
    <div className="flow-root font-genos">
      <ul role="list" className="-mb-8">
        {MOCK_ACTIVITIES.map((activity, activityIdx) =>
        <motion.li
          key={activity.id}
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            delay: activityIdx * 0.1
          }}>
          
            <div className="relative pb-8">
              {activityIdx !== MOCK_ACTIVITIES.length - 1 ?
            <span
              className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-[#1A1A24]"
              aria-hidden="true" /> :

            null}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-[#111118] ${getBgColor(activity.type)}`}>
                  
                    {getIcon(activity.type)}
                  </div>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-300">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={activity.timestamp}>
                      {formatDate(activity.timestamp, i18n.language)}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </motion.li>
        )}
      </ul>
    </div>);

}