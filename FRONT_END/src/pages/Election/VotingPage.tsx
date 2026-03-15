import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ClockIcon,
  ShieldCheckIcon,
  AlertCircleIcon,
  ExternalLinkIcon,
  CheckCircle2Icon } from
'lucide-react';
import { MOCK_ELECTIONS, MOCK_CANDIDATES } from '../../utils/constants';
import { formatTimeRemaining } from '../../utils/helpers';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { VotingInterface } from '../../components/election/VotingInterface';
import { toast } from 'sonner';
export function VotingPage() {
  const { t, i18n } = useTranslation(['election', 'common']);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [txHash, setTxHash] = useState('');
  const election = MOCK_ELECTIONS.find((e) => e.id === id) || MOCK_ELECTIONS[0];
  const handleVoteSubmit = (selectedIds: string[]) => {
    setSelectedCandidates(selectedIds);
    setShowConfirmModal(true);
  };
  const confirmVote = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const mockHash =
      '0x' +
      Array.from(
        {
          length: 64
        },
        () => Math.floor(Math.random() * 16).toString(16)
      ).join('');
      setTxHash(mockHash);
      setHasVoted(true);
      setShowConfirmModal(false);
      toast.success(t('election:voteSuccess'));
    } catch (error) {
      toast.error(t('election:voteFailed'));
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (hasVoted) {
    return (
      <div className="max-w-3xl mx-auto py-12 font-genos">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            type: 'spring',
            bounce: 0.5
          }}>
          
          <Card className="p-8 text-center border-t-4 border-t-green-500 bg-[#111118]">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheckIcon className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {t('election:voteRecorded')}
            </h2>
            <p className="text-gray-400 mb-8">
              {t('election:voteRecordedDesc')}
            </p>

            <div className="bg-[#0A0A0F] rounded-xl p-6 text-left mb-8 border border-[#1A1A24]">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                {t('election:transactionReceipt')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    {t('election:election')}:
                  </span>
                  <span className="font-medium text-white">
                    {election.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    {t('organization:memberTable.status', {
                      ns: 'organization'
                    })}
                    :
                  </span>
                  <span className="font-medium text-green-400">
                    {t('election:statusConfirmed')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    {t('election:transactionHash')}:
                  </span>
                  <a
                    href="#"
                    className="font-mono text-sm text-red-400 hover:text-red-300 flex items-center">
                    
                    {txHash.substring(0, 10)}...
                    {txHash.substring(txHash.length - 8)}
                    <ExternalLinkIcon className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                {t('election:returnToDashboard')}
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate(`/elections/${election.id}/results`)}>
                
                {t('election:viewResults')}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>);

  }
  return (
    <div className="max-w-4xl mx-auto space-y-8 font-genos">
      {/* Election Header */}
      <div className="bg-[#111118] rounded-2xl shadow-sm border border-red-500/10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <span className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2 block">
              {election.orgName}
            </span>
            <h1 className="text-3xl font-bold text-white mb-2">
              {election.name}
            </h1>
            <p className="text-gray-400 max-w-2xl">{election.description}</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center shrink-0">
            <ClockIcon className="w-5 h-5 text-red-400 mr-3" />
            <div>
              <p className="text-xs text-red-400 font-bold uppercase">
                {t('election:timeRemaining')}
              </p>
              <p className="text-lg font-bold text-red-400">
                {formatTimeRemaining(election.endDate, i18n.language)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-400 bg-[#1A1A24] p-3 rounded-lg">
          <ShieldCheckIcon className="w-4 h-4 mr-2 text-green-400" />
          {t('election:secureElection')}
        </div>
      </div>

      {/* Voting Interface */}
      <Card className="p-6 md:p-8">
        <h2 className="text-xl font-bold text-white mb-6">
          {t('election:castYourVote')}
        </h2>
        <VotingInterface
          candidates={MOCK_CANDIDATES}
          type={election.type as 'single' | 'multiple'}
          onSubmit={handleVoteSubmit}
          isLoading={isSubmitting} />
        
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => !isSubmitting && setShowConfirmModal(false)}
        title={t('election:confirmVote')}>
        
        <div className="space-y-6">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start">
            <AlertCircleIcon className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-yellow-300">
                {t('election:irreversibleAction')}
              </h4>
              <p className="text-sm text-yellow-400/80 mt-1">
                {t('election:irreversibleDesc')}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              {t('election:votingFor')}
            </h4>
            <ul className="space-y-2">
              {selectedCandidates.map((cId) => {
                const candidate = MOCK_CANDIDATES.find((c) => c.id === cId);
                return (
                  <li
                    key={cId}
                    className="bg-[#1A1A24] p-3 rounded-lg border border-[#2A2A34] font-medium text-white flex items-center">
                    
                    <CheckCircle2Icon className="w-4 h-4 text-green-400 mr-2" />
                    {candidate?.name}
                  </li>);

              })}
            </ul>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#1A1A24]">
            <Button
              variant="ghost"
              onClick={() => setShowConfirmModal(false)}
              disabled={isSubmitting}>
              
              {t('common:cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={confirmVote}
              loading={isSubmitting}
              className="min-w-[150px]">
              
              {t('election:signSubmit')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}