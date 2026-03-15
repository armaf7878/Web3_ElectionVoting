import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  DownloadIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
  UsersIcon } from
'lucide-react';
import { MOCK_ELECTIONS, MOCK_CANDIDATES } from '../../utils/constants';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ResultChart } from '../../components/election/ResultChart';
export function Results() {
  const { t, i18n } = useTranslation('election');
  const { id } = useParams();
  const election = MOCK_ELECTIONS.find((e) => e.id === id) || MOCK_ELECTIONS[0];
  const totalVotes = MOCK_CANDIDATES.reduce((sum, c) => sum + c.votes, 0);
  const participationRate =
  Math.round(election.participantCount / election.totalEligible * 100) || 0;
  return (
    <div className="max-w-5xl mx-auto space-y-8 font-genos">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1A1A24] text-gray-300 mb-3">
            <ShieldCheckIcon className="w-3 h-3 mr-1" />
            {t('officialResults')}
          </span>
          <h1 className="text-3xl font-bold text-white">{election.name}</h1>
          <p className="text-gray-400 mt-1">{election.orgName}</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            leftIcon={<DownloadIcon className="w-4 h-4" />}>
            
            {t('exportCSV')}
          </Button>
          <Button
            variant="secondary"
            leftIcon={<ExternalLinkIcon className="w-4 h-4" />}>
            
            {t('verifyOnExplorer')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Results Area */}
        <div className="lg:col-span-2 space-y-8">
          <ResultChart data={MOCK_CANDIDATES} totalVotes={totalVotes} />
        </div>

        {/* Sidebar Stats */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}>
            
            <Card className="bg-[#0A0A0F] text-white border-red-500/10">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <UsersIcon className="w-5 h-5 mr-2 text-red-500" />
                {t('voterTurnout')}
              </h3>

              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-4xl font-black text-white">
                    {participationRate}%
                  </span>
                  <span className="text-gray-400 text-sm mb-1">
                    {t('participation')}
                  </span>
                </div>
                <div className="w-full bg-[#1A1A24] rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-600 to-red-400 h-3 rounded-full"
                    style={{
                      width: `${participationRate}%`
                    }} />
                  
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-[#1A1A24] pb-2">
                  <span className="text-gray-400">{t('totalVotesCast')}</span>
                  <span className="font-bold">
                    {election.participantCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#1A1A24] pb-2">
                  <span className="text-gray-400">{t('eligibleVoters')}</span>
                  <span className="font-bold">
                    {election.totalEligible.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-gray-400">{t('smartContract')}</span>
                  <a
                    href="#"
                    className="font-mono text-red-400 hover:text-red-300">
                    
                    0x8f...3a2b
                  </a>
                </div>
              </div>
            </Card>
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
            transition={{
              delay: 0.2
            }}>
            
            <Card>
              <h3 className="text-lg font-bold text-white mb-4">
                {t('electionDetailsLabel')}
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-gray-500 mb-1">{t('type')}</span>
                  <span className="font-medium text-white capitalize">
                    {election.type === 'single' ?
                    t('singleChoice') :
                    t('multipleChoice')}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">
                    {t('started')}
                  </span>
                  <span className="font-medium text-white">
                    {new Date(election.startDate).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">{t('ended')}</span>
                  <span className="font-medium text-white">
                    {new Date(election.endDate).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>);

}