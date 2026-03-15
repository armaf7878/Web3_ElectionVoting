import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  BuildingIcon,
  VoteIcon,
  CheckSquareIcon,
  BellIcon,
  ArrowRightIcon } from
'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { StatsCard } from '../components/dashboard/StatsCard';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { QuickActions } from '../components/dashboard/QuickActions';
import { ElectionCard } from '../components/election/ElectionCard';
import { Card } from '../components/common/Card';
import { MOCK_ELECTIONS } from '../utils/constants';
export function Dashboard() {
  const { t } = useTranslation(['dashboard', 'common']);
  const { user } = useAuth();
  const upcomingElections = MOCK_ELECTIONS.filter(
    (e) => e.status !== 'ended'
  ).slice(0, 2);
  return (
    <div className="space-y-8 font-genos">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}>
          
          <h1 className="text-3xl font-bold text-white">
            {t('dashboard:welcomeBack', {
              name: user?.name.split(' ')[0]
            })}
          </h1>
          <p className="text-gray-400 mt-1">{t('dashboard:subtitle')}</p>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          className="mt-4 md:mt-0">
          
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            {t('dashboard:networkSync')}
          </span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('dashboard:organizations')}
          value="3"
          change="+1"
          changeType="positive"
          icon={<BuildingIcon className="w-6 h-6" />}
          delay={0.1} />
        
        <StatsCard
          title={t('dashboard:activeElections')}
          value="2"
          change="Same"
          changeType="neutral"
          icon={<VoteIcon className="w-6 h-6" />}
          delay={0.2} />
        
        <StatsCard
          title={t('dashboard:completedVotes')}
          value="14"
          change="+3"
          changeType="positive"
          icon={<CheckSquareIcon className="w-6 h-6" />}
          delay={0.3} />
        
        <StatsCard
          title={t('dashboard:pendingInvites')}
          value="1"
          change="-2"
          changeType="negative"
          icon={<BellIcon className="w-6 h-6" />}
          delay={0.4} />
        
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Activity Feed */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {t('dashboard:recentActivity')}
              </h2>
              <Link
                to="/profile"
                className="text-sm font-medium text-red-400 hover:text-red-300">
                
                {t('common:viewAll')}
              </Link>
            </div>
            <ActivityFeed />
          </Card>
        </div>

        {/* Right Column: Quick Actions & Upcoming Elections */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              {t('dashboard:quickActions')}
            </h2>
            <QuickActions />
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {t('dashboard:actionRequired')}
              </h2>
              <Link
                to="/elections"
                className="text-sm font-medium text-red-400 hover:text-red-300 flex items-center">
                
                {t('dashboard:allElections')}{' '}
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {upcomingElections.map((election, index) =>
              <motion.div
                key={election.id}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.3 + index * 0.1
                }}>
                
                  <ElectionCard election={election} />
                </motion.div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>);

}