import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SearchIcon, PlusIcon, FilterIcon, BuildingIcon } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { OrgCard } from '../../components/organization/OrgCard';
import { MOCK_ORGS } from '../../utils/constants';
import { toast } from 'sonner';
export function OrgList() {
  const { t } = useTranslation(['organization', 'common']);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'joined' | 'owned'>('all');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const filteredOrgs = MOCK_ORGS.filter((org) => {
    const matchesSearch =
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'joined') return matchesSearch && org.joined;
    if (filter === 'owned')
    return matchesSearch && org.owner === '0x7a3B...4f2E';
    return matchesSearch;
  });
  const handleJoin = async () => {
    if (!joinCode) return;
    setIsJoining(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsJoining(false);
    setIsJoinModalOpen(false);
    toast.success(t('organization:joinSuccess'));
    setJoinCode('');
  };
  return (
    <div className="space-y-8 font-genos">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {t('organization:title')}
          </h1>
          <p className="text-gray-400 mt-1">{t('organization:subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsJoinModalOpen(true)}>
            {t('organization:joinWithCode')}
          </Button>
          <Link to="/organizations/create">
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="w-5 h-5" />}>
              
              {t('organization:createOrg')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#111118] p-4 rounded-xl shadow-sm border border-red-500/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-gray-400 hover:bg-white/5'}`}>
            
            {t('organization:allOrganizations')}
          </button>
          <button
            onClick={() => setFilter('joined')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'joined' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-gray-400 hover:bg-white/5'}`}>
            
            {t('organization:joined')}
          </button>
          <button
            onClick={() => setFilter('owned')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'owned' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-gray-400 hover:bg-white/5'}`}>
            
            {t('organization:myOrganizations')}
          </button>
        </div>

        <div className="w-full md:w-72 relative">
          <Input
            placeholder={t('organization:searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<SearchIcon className="w-5 h-5" />}
            className="bg-[#1A1A24]" />
          
        </div>
      </div>

      {/* Grid */}
      {filteredOrgs.length > 0 ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredOrgs.map((org, index) =>
          <motion.div
            key={org.id}
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
            
                <OrgCard org={org} onJoin={() => setIsJoinModalOpen(true)} />
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
            <BuildingIcon className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {t('organization:noOrgsFound')}
          </h3>
          <p className="text-gray-400 max-w-sm mx-auto mb-6">
            {t('organization:noOrgsFoundDesc')}
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

      {/* Join Modal */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title={t('organization:joinOrganization')}>
        
        <div className="space-y-4">
          <p className="text-gray-400">{t('organization:joinModalDesc')}</p>
          <Input
            label={t('organization:inviteCode')}
            placeholder="e.g. ETHFND"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="font-mono text-center tracking-widest text-lg uppercase" />
          
          <div className="pt-4 flex justify-end space-x-3">
            <Button variant="ghost" onClick={() => setIsJoinModalOpen(false)}>
              {t('common:cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={handleJoin}
              loading={isJoining}
              disabled={joinCode.length < 6}>
              
              {t('organization:joinOrganization')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}