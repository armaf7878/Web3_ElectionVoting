import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SearchIcon, PlusIcon, VoteIcon } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ElectionCard } from '../../components/election/ElectionCard';
import { MOCK_ELECTIONS } from '../../utils/constants';
export function ElectionList() {
  const { t } = useTranslation(['election', 'common']);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'ended'>(
    'all'
  );
  const filterLabels: Record<string, string> = {
    all: t('election:filterAll'),
    active: t('election:filterActive'),
    upcoming: t('election:filterUpcoming'),
    ended: t('election:filterEnded')
  };
  const filteredElections = MOCK_ELECTIONS.filter((election) => {
    const matchesSearch =
    election.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    election.orgName.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && election.status === filter;
  });
  return (
    <div className="space-y-8 font-genos">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {t('election:title')}
          </h1>
          <p className="text-gray-400 mt-1">{t('election:subtitle')}</p>
        </div>
        <div>
          <Link to="/elections/create">
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="w-5 h-5" />}>
              
              {t('election:createElection')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#111118] p-4 rounded-xl shadow-sm border border-red-500/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['all', 'active', 'upcoming', 'ended'].map((f) =>
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap capitalize transition-colors ${filter === f ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-gray-400 hover:bg-white/5'}`}>
            
              {filterLabels[f]}
            </button>
          )}
        </div>

        <div className="w-full md:w-72 relative">
          <Input
            placeholder={t('election:searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<SearchIcon className="w-5 h-5" />}
            className="bg-[#1A1A24]" />
          
        </div>
      </div>

      {/* Grid */}
      {filteredElections.length > 0 ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredElections.map((election, index) =>
          <motion.div
            key={election.id}
            layout
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.9
            }}
            transition={{
              duration: 0.2,
              delay: index * 0.05
            }}>
            
                <ElectionCard election={election} />
              </motion.div>
          )}
          </AnimatePresence>
        </div> :

      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        className="text-center py-20 bg-[#111118] rounded-xl border border-[#1A1A24] border-dashed">
        
          <div className="bg-[#1A1A24] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <VoteIcon className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t('election:noElectionsFound')}
          </h3>
          <p className="text-gray-400 max-w-sm mx-auto mb-6">
            {t('election:noElectionsFoundDesc')}
          </p>
          <Button
          variant="outline"
          onClick={() => {
            setSearchTerm('');
            setFilter('all');
          }}>
          
            {t('common:clearFilters')}
          </Button>
        </motion.div>
      }
    </div>);

}