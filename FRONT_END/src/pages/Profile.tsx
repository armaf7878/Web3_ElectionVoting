import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  UserIcon,
  MailIcon,
  CalendarIcon,
  CopyIcon,
  ShieldCheckIcon,
  HistoryIcon,
  BuildingIcon } from
'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useWeb3 } from '../hooks/useWeb3';
import { MOCK_ORGS, MOCK_ACTIVITIES } from '../utils/constants';
import { truncateAddress, formatDate } from '../utils/helpers';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { OrgCard } from '../components/organization/OrgCard';
import { toast } from 'sonner';
export function Profile() {
  const { t, i18n } = useTranslation(['profile', 'common']);
  const { user } = useAuth();
  const { address, isConnected } = useWeb3();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'organizations' | 'history'>(
    'organizations'
  );
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const myOrgs = MOCK_ORGS.filter((org) => org.joined);
  const voteHistory = MOCK_ACTIVITIES.filter((act) => act.type === 'vote');
  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success(t('profile:walletCopied'));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success(t('profile:profileUpdated'));
  };
  return (
    <div className="max-w-5xl mx-auto space-y-8 font-genos">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {t('profile:title')}
          </h1>
          <p className="text-gray-400 mt-1">{t('profile:subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}>
            
            <Card className="overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-red-600 to-red-400 relative">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                    'radial-gradient(#fff 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }} />
                
              </div>

              <div className="px-6 pb-6 relative">
                <div className="flex justify-center -mt-12 mb-4">
                  <div className="w-24 h-24 rounded-full border-4 border-[#111118] shadow-lg overflow-hidden bg-[#1A1A24]">
                    {user?.avatar ?
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover" /> :


                    <div className="w-full h-full bg-[#1A1A24] flex items-center justify-center">
                        <UserIcon className="w-10 h-10 text-gray-500" />
                      </div>
                    }
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {user?.name}
                  </h2>
                  <p className="text-gray-400 flex items-center justify-center mt-1">
                    <MailIcon className="w-4 h-4 mr-1.5" />
                    {user?.email}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#0A0A0F] rounded-xl p-4 border border-[#1A1A24]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {t('profile:connectedWallet')}
                      </span>
                      {isConnected &&
                      <span className="flex items-center text-xs font-medium text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                          {t('common:active')}
                        </span>
                      }
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-gray-200 font-medium">
                        {isConnected ?
                        truncateAddress(address!) :
                        t('profile:notConnected')}
                      </span>
                      {isConnected &&
                      <button
                        onClick={handleCopyAddress}
                        className="text-gray-500 hover:text-red-400 transition-colors">
                        
                          <CopyIcon className="w-4 h-4" />
                        </button>
                      }
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 justify-center">
                    <CalendarIcon className="w-4 h-4 mr-1.5" />
                    {t('profile:joined')}{' '}
                    {user?.joinedAt ?
                    formatDate(user.joinedAt, i18n.language).split(',')[0] :
                    t('profile:recently')}
                  </div>

                  <Button
                    variant={isEditing ? 'outline' : 'primary'}
                    fullWidth
                    onClick={() => setIsEditing(!isEditing)}>
                    
                    {isEditing ?
                    t('profile:cancelEditing') :
                    t('profile:editProfile')}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Identity Verification Card */}
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
              delay: 0.1
            }}>
            
            <Card className="bg-gradient-to-br from-[#111118] to-[#0A0A0F] text-white border-red-500/10">
              <div className="flex items-center mb-4">
                <div className="bg-green-500/20 p-2 rounded-lg mr-3">
                  <ShieldCheckIcon className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {t('profile:identityVerified')}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {t('profile:kycComplete')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                {t('profile:identityVerifiedDesc')}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-[#2A2A34] text-gray-300 hover:bg-white/5 hover:text-white">
                
                {t('profile:viewOnChainCredential')}
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {isEditing ?
          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}>
            
              <Card className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6">
                  {t('profile:editProfile')}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                  label={t('profile:fullName')}
                  value={formData.name}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                  }
                  icon={<UserIcon className="w-5 h-5" />} />
                
                  <Input
                  label={t('profile:emailAddress')}
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value
                  })
                  }
                  icon={<MailIcon className="w-5 h-5" />} />
                
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" variant="primary">
                      {t('profile:saveChanges')}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div> :

          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}>
            
              <Card className="p-0 overflow-hidden">
                <div className="border-b border-[#1A1A24] px-6 pt-6">
                  <nav className="-mb-px flex space-x-8">
                    <button
                    onClick={() => setActiveTab('organizations')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${activeTab === 'organizations' ? 'border-red-500 text-red-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                    
                      <BuildingIcon className="w-4 h-4 mr-2" />
                      {t('profile:myOrganizations')}
                    </button>
                    <button
                    onClick={() => setActiveTab('history')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${activeTab === 'history' ? 'border-red-500 text-red-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                    
                      <HistoryIcon className="w-4 h-4 mr-2" />
                      {t('profile:votingHistory')}
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'organizations' &&
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {myOrgs.map((org) =>
                  <OrgCard key={org.id} org={org} />
                  )}
                    </div>
                }

                  {activeTab === 'history' &&
                <div className="flow-root">
                      <ul role="list" className="-mb-8">
                        {voteHistory.map((activity, activityIdx) =>
                    <li key={activity.id}>
                            <div className="relative pb-8">
                              {activityIdx !== voteHistory.length - 1 ?
                        <span
                          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-[#1A1A24]"
                          aria-hidden="true" /> :

                        null}
                              <div className="relative flex items-start space-x-3">
                                <div className="relative">
                                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center ring-8 ring-[#111118]">
                                    <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-white font-medium">
                                      {activity.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Tx:{' '}
                                      <a
                                  href="#"
                                  className="font-mono text-red-400 hover:underline">
                                  
                                        0x
                                        {Math.random().
                                  toString(16).
                                  substr(2, 8)}
                                        ...
                                      </a>
                                    </p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    <time dateTime={activity.timestamp}>
                                      {
                                formatDate(
                                  activity.timestamp,
                                  i18n.language
                                ).split(',')[0]
                                }
                                    </time>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                    )}
                      </ul>
                    </div>
                }
                </div>
              </Card>
            </motion.div>
          }
        </div>
      </div>
    </div>);

}