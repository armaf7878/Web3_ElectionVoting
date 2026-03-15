import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  UsersIcon,
  VoteIcon,
  SettingsIcon,
  CopyIcon,
  ShieldCheckIcon,
  PlusIcon } from
'lucide-react';
import { truncateAddress } from '../../utils/helpers';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ElectionCard } from '../../components/election/ElectionCard';
import { useAuth } from '../../hooks/useAuth';
import { useWeb3 } from '../../hooks/useWeb3';
import { useEffect } from 'react';
import { api } from '../../api';
import { toast } from 'sonner';

interface Member {
  walletAddress: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Organization {
  _id: string;
  name: string;
  description: string;
  code: string;
  owner: string;
  members: Member[];
}
export function OrgDetail() {
  const { t } = useTranslation(['organization', 'common']);
  const { user } = useAuth();
  const { address: web3Address } = useWeb3();
  const { id } = useParams();
  
  const [org, setOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'elections' | 'settings'>('overview');

  const fetchOrgDetail = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/organizations/organizations/${id}`);
      setOrg(response.data);
    } catch (error: any) {
      console.error('Failed to fetch org detail:', error);
      toast.error(t('common:errorOccurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrgDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Organization Not Found</h2>
        <Link to="/organizations">
          <Button variant="outline">Back to Organizations</Button>
        </Link>
      </div>
    );
  }

  // Election data remains mock for now as requested task focuses on members
  const orgElections: any[] = []; 
  
  const currentUserAddress = user?.walletAddress || web3Address;
  const isOwner = !!currentUserAddress && !!org?.owner && 
                  currentUserAddress.toLowerCase() === org.owner.toLowerCase();

  const approvedMembers = org.members.filter(m => m.status === 'approved');
  const pendingRequests = org.members.filter(m => m.status === 'pending');

  const copyCode = () => {
    navigator.clipboard.writeText(org.code || '');
    toast.success(t('organization:inviteCodeCopied'));
  };

  const handleApproveMember = async (walletAddress: string) => {
    try {
      await api.post('/organizations/organizations/approve', {
         organizationId: org._id,
         walletAddress
      });
      toast.success(t('organization:approveSuccess') || 'Member approved');
      fetchOrgDetail();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to approve');
    }
  };

  const handleRejectMember = async (walletAddress: string) => {
    try {
      await api.post('/organizations/organizations/reject', {
         organizationId: org._id,
         walletAddress
      });
      toast.success(t('organization:rejectSuccess') || 'Member rejected');
      fetchOrgDetail();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reject');
    }
  };
  function BuildingIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <path d="M9 22v-4h6v4"></path>
        <path d="M8 6h.01"></path>
        <path d="M16 6h.01"></path>
        <path d="M12 6h.01"></path>
        <path d="M12 10h.01"></path>
        <path d="M12 14h.01"></path>
        <path d="M16 10h.01"></path>
        <path d="M16 14h.01"></path>
        <path d="M8 10h.01"></path>
        <path d="M8 14h.01"></path>
      </svg>);

  }
  const tabs = [
  {
    id: 'overview',
    label: t('organization:overview'),
    icon: <BuildingIcon className="w-4 h-4" />
  },
  {
    id: 'members',
    label: t('common:members'),
    icon: <UsersIcon className="w-4 h-4" />
  },
  {
    id: 'elections',
    label: t('organization:elections'),
    icon: <VoteIcon className="w-4 h-4" />
  },
  ...(isOwner ?
  [
  {
    id: 'settings',
    label: t('organization:settings'),
    icon: <SettingsIcon className="w-4 h-4" />
  }] :

  [])];

  return (
    <div className="space-y-8 font-genos">
      {/* Header */}
      <div className="bg-[#111118] rounded-2xl shadow-sm border border-red-500/10 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-red-600 to-red-400 relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }} />
          
        </div>

        <div className="px-6 sm:px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-16 mb-6">
            <div className="flex items-end space-x-5">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-[#111118] p-2 shadow-lg relative z-10">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1A1A24] to-[#2A2A34] flex items-center justify-center text-4xl font-bold text-gray-500">
                  {org.name.charAt(0)}
                </div>
              </div>
              <div className="pb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {org.name}
                </h1>
                <div className="flex items-center text-sm text-gray-400 mt-1 space-x-4">
                  <span className="flex items-center">
                    <ShieldCheckIcon className="w-4 h-4 mr-1 text-green-400" />
                    {t('common:verifiedOrg')}
                  </span>
                  <span className="flex items-center">
                    {t('common:owner')}:{' '}
                    <span className="font-mono ml-1 bg-[#1A1A24] px-1.5 rounded">
                      {truncateAddress(org.owner)}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-0 flex items-center space-x-3">
              <div className="bg-[#1A1A24] border border-[#2A2A34] rounded-lg px-3 py-2 flex items-center">
                <span className="text-xs text-gray-500 uppercase font-semibold mr-2">
                  {t('common:code')}:
                </span>
                <span className="font-mono font-bold text-white tracking-wider">
                  {org.code}
                </span>
                <button
                  onClick={copyCode}
                  className="ml-2 text-gray-400 hover:text-red-400 transition-colors">
                  
                  <CopyIcon className="w-4 h-4" />
                </button>
              </div>
              {isOwner &&
              <Link to="/elections/create">
                  <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<PlusIcon className="w-4 h-4" />}>
                  
                    {t('organization:newElection')}
                  </Button>
                </Link>
              }
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[#1A1A24]">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) =>
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors
                    ${activeTab === tab.id ? 'border-red-500 text-red-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}
                  `}>
                
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -10
            }}
            transition={{
              duration: 0.2
            }}>
            
            {activeTab === 'overview' &&
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <h3 className="text-lg font-bold text-white mb-3">
                      {t('organization:about')}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {org.description}
                    </p>
                  </Card>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">
                        {t('organization:recentElections')}
                      </h3>
                      <button
                      onClick={() => setActiveTab('elections')}
                      className="text-sm text-red-400 font-medium hover:text-red-300">
                      
                        {t('common:viewAll')}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {orgElections.slice(0, 2).map((election) =>
                    <ElectionCard key={election.id} election={election} />
                    )}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <Card>
                    <h3 className="text-lg font-bold text-white mb-4">
                      {t('organization:statistics')}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-[#1A1A24]">
                        <span className="text-gray-400 flex items-center">
                          <UsersIcon className="w-4 h-4 mr-2" />{' '}
                          {t('organization:totalMembers')}
                        </span>
                        <span className="font-bold text-white">
                          {approvedMembers.length.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-[#1A1A24]">
                        <span className="text-gray-400 flex items-center">
                          <VoteIcon className="w-4 h-4 mr-2" />{' '}
                          {t('dashboard:activeElections', {
                          ns: 'dashboard'
                        })}
                        </span>
                        <span className="font-bold text-white">
                          0
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center">
                          <ShieldCheckIcon className="w-4 h-4 mr-2" />{' '}
                          {t('organization:totalElections')}
                        </span>
                        <span className="font-bold text-white">
                          {orgElections.length}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            }

            {activeTab === 'elections' &&
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orgElections.map((election) =>
              <ElectionCard key={election.id} election={election} />
              )}
                {orgElections.length === 0 &&
              <div className="col-span-full text-center py-12 bg-[#111118] rounded-xl border border-[#1A1A24] border-dashed">
                    <VoteIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white">
                      {t('organization:noElectionsYet')}
                    </h3>
                    <p className="text-gray-400 mt-1">
                      {t('organization:noElectionsYetDesc')}
                    </p>
                  </div>
              }
              </div>
            }

            {activeTab === 'members' && 
            <div className="space-y-6">
                {isOwner && pendingRequests.length > 0 && (
                  <Card className="overflow-hidden border-yellow-500/20">
                    <div className="px-6 py-4 bg-yellow-500/5 border-b border-[#1A1A24]">
                        <h3 className="text-lg font-bold text-yellow-500 flex items-center">
                            <PlusIcon className="w-4 h-4 mr-2" />
                            {t('organization:pendingRequests')}
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[#1A1A24]">
                        <tbody className="bg-[#111118] divide-y divide-[#1A1A24]">
                          {pendingRequests.map((req, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-mono text-gray-300">
                                  {req.walletAddress}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                <Button 
                                  variant="primary" 
                                  size="sm" 
                                  onClick={() => handleApproveMember(req.walletAddress)}
                                >
                                  {t('common:approve')}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleRejectMember(req.walletAddress)}
                                >
                                  {t('common:reject')}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}

                <Card className="overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#1A1A24]">
                        <h3 className="text-lg font-bold text-white">
                            {t('organization:memberList')}
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[#1A1A24]">
                        <thead className="bg-[#0A0A0F]">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('organization:memberTable.member')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('organization:memberTable.role')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('organization:memberTable.status')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-[#111118] divide-y divide-[#1A1A24]">
                          {approvedMembers.map((member, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center text-white font-bold text-xs">
                                    {member.walletAddress.toLowerCase() === org.owner.toLowerCase() ? 'O' : 'M'}
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-mono text-gray-300">
                                      {truncateAddress(member.walletAddress)}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.walletAddress.toLowerCase() === org.owner.toLowerCase() ? 'bg-purple-500/20 text-purple-400' : 'bg-[#1A1A24] text-gray-300'}`}>
                                  {member.walletAddress.toLowerCase() === org.owner.toLowerCase() ? t('common:owner') : t('common:voter')}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500/20 text-green-400">
                                  {t('common:active')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
            </div>
            }

            {activeTab === 'settings' && isOwner &&
            <div className="max-w-2xl">
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {t('organization:orgSettings')}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    {t('organization:orgSettingsDesc')}
                  </p>

                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {t('organization:orgName')}
                      </label>
                      <input
                      type="text"
                      defaultValue={org.name}
                      className="block w-full rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-base p-2 border bg-[#1A1A24]/80 border-[#2A2A34] text-white" />
                    
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {t('organization:description')}
                      </label>
                      <textarea
                      rows={3}
                      defaultValue={org.description}
                      className="block w-full rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-base p-2 border bg-[#1A1A24]/80 border-[#2A2A34] text-white" />
                    
                    </div>
                    <div className="pt-4">
                      <Button variant="primary">
                        {t('organization:saveChanges')}
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </div>);

}